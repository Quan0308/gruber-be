import { Booking, DriverVehicle } from "@db/entities";
import { CreateAssignBookingDriverMessageDto, CreateBookingByPassengerDto, CreateBookingByStaffDto } from "@dtos";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";
import { BookingRouteService } from "../booking_route/booking-route.service";
import {
  BookingStatus,
  IAllBookings,
  IBookingDetail,
  IBookingRoute,
  ICurrentBookingDriver,
  ICurrentBookingUser,
  MessageBooking,
  PaymentMethod,
  RoleEnum,
  VehicleTypePrice,
} from "@types";
import { plainToClass } from "class-transformer";
import { UserService } from "../user/user.service";
import { BookingGateway } from "../gateway/booking.gateway";

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(DriverVehicle)
    private driverVehicleRepository: Repository<DriverVehicle>,
    private readonly userService: UserService,
    private readonly bookingRouteService: BookingRouteService,
    private readonly bookingGateway: BookingGateway
  ) {}

  async createBooking(data: CreateBookingByPassengerDto | CreateBookingByStaffDto) {
    const { user_id } = data;
    const user = await this.userService.getUserById(user_id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user.role === RoleEnum.PASSENGER
      ? this.createBookingByPassenger(plainToClass(CreateBookingByPassengerDto, data), user.fullName, user.phone)
      : this.createBookingByStaff(plainToClass(CreateBookingByStaffDto, data));
  }

  async createBookingByPassenger(data: CreateBookingByPassengerDto, name: string, phone: string) {
    try {
      const { user_id, booking_route, vehicle_type, payment_method } = data;
      const route = await this.bookingRouteService.createBookingRoute({
        from: booking_route.pick_up,
        to: booking_route.destination,
      });
      const distance = await this.bookingRouteService.getDistanceOfRoute(route.pickupLocationId, route.destinationId);
      const price = this.getPriceByDistance(distance * 1000);
      return await this.bookingRepository.save({
        ordered_by_Id: user_id,
        name,
        phone,
        price: price[vehicle_type],
        bookingRouteId: route.id,
        vehicleType: vehicle_type,
        paymentMethod: payment_method,
        createdBy: user_id,
        updatedBy: user_id,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async createBookingByStaff(data: CreateBookingByStaffDto) {
    try {
      const { user_id, driver_id, booking_route, name, phone, vehicle_type } = data;
      const driver = await this.userService.getUserById(driver_id);
      if (!driver || driver.role !== RoleEnum.DRIVER) {
        throw new NotFoundException("Driver not found");
      }
      const route = await this.bookingRouteService.createBookingRouteByLocationIds(
        booking_route.pick_up,
        booking_route.destination
      );
      const distance = await this.bookingRouteService.getDistanceOfRoute(route.pickupLocationId, route.destinationId);
      const price = this.getPriceByDistance(distance * 1000);
      const newBooking = await this.bookingRepository.save({
        ordered_by_Id: user_id,
        driverId: driver_id,
        name,
        phone,
        price: price[vehicle_type],
        bookingRouteId: route.id,
        vehicleType: vehicle_type,
        createdBy: user_id,
        updatedBy: user_id,
        paymentMethod: PaymentMethod.CASH,
      });

      const bookingRoute = await this.bookingRouteService.getBookingRouteDetails(route.id);

      const socketBody: CreateAssignBookingDriverMessageDto = {
        booking_id: newBooking.id,
        driver_id: newBooking.driverId,
        booking_route: {
          pick_up: bookingRoute.pick_up,
          destination: bookingRoute.destination,
        },
        message: MessageBooking.CREATE_ASSIGN_BOOKING_DRIVER,
      };

      this.bookingGateway.sendAssignmentMessage(socketBody);
      return newBooking;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async updateBookingStatus(bookingId: string, targetStatus: BookingStatus, updatedById: string) {
    try {
      const booking = await this.bookingRepository.findOne({ where: { id: bookingId } });
      const user = await this.userService.getUserById(updatedById);
      if (!booking || !user) {
        throw new NotFoundException("Booking or user not found");
      }
      switch (targetStatus) {
        case BookingStatus.CANCELLED:
          if (booking.status !== BookingStatus.PENDING) throw new Error("Cannot cancel booking that is not pending");
          break;
        case BookingStatus.PICKED_UP:
          booking.startedOn = new Date(new Date().toISOString());
          break;
        case BookingStatus.ARRIVED:
          targetStatus = booking.paymentMethod === PaymentMethod.CARD ? BookingStatus.COMPLETED : targetStatus;
          break;
        default:
          break;
      }
      booking.status = targetStatus;
      booking.updatedBy = updatedById;
      targetStatus === BookingStatus.COMPLETED ||
        (BookingStatus.CANCELLED && (booking.completedOn = new Date(new Date().toISOString())));

      return await this.bookingRepository.save(booking);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getCurrentBookingByUserId(userId: string) {
    try {
      const user = await this.userService.getUserById(userId);
      if (!user) {
        throw new NotFoundException("User not found");
      }
      let query = this.bookingRepository.createQueryBuilder("booking");
      query =
        user.role === RoleEnum.DRIVER
          ? query.where("booking.driverId = :id", { id: userId })
          : query.where("booking.ordered_by_Id = :id", { id: userId });
      const booking = await query
        .andWhere("booking.status != :status", { status: BookingStatus.COMPLETED && BookingStatus.CANCELLED })
        .orderBy("booking.createdOn", "DESC")
        .select([
          "booking.id",
          "booking.bookingRouteId",
          "booking.driverId",
          "booking.name",
          "booking.phone",
          "booking.status",
          "booking.paymentMethod",
          "booking.vehicleType",
          "booking.price",
        ])
        .leftJoin("booking.driver", "driver")
        .addSelect(["driver.fullName", "driver.phone", "driver.avatar"])
        .getOne();
      if (!booking) {
        throw new NotFoundException("Booking not found");
      }
      const driver_vehicle = await this.driverVehicleRepository.findOne({ where: { ownerId: booking.driverId } });
      const booking_route = await this.bookingRouteService.getBookingRouteDetails(booking.bookingRouteId);
      return user.role === RoleEnum.DRIVER
        ? this.mapToCurrentBookingDriver(booking, booking_route)
        : this.mapToCurrentBookingUser(booking, driver_vehicle, booking_route);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllBookings(user_id: string): Promise<IAllBookings[]> {
    const user = await this.userService.getUserById(user_id);
    try {
      const whereClause = user.role === RoleEnum.DRIVER ? { driverId: user_id } : { ordered_by_Id: user_id };
      const bookings = await this.bookingRepository
        .createQueryBuilder("booking")
        .where(whereClause)
        .andWhere(
          new Brackets((qb) => {
            qb.where("booking.status = :completed", { completed: BookingStatus.COMPLETED }).orWhere(
              "booking.status = :cancelled",
              { cancelled: BookingStatus.CANCELLED }
            );
          })
        )
        .select([
          "booking.id",
          "booking.paymentMethod",
          "booking.completedOn",
          "booking.price",
          "booking.vehicleType",
          "booking.status",
        ])
        .orderBy("booking.createdOn", "DESC")
        .leftJoin("booking.route", "route")
        .addSelect(["route.id"])
        .leftJoin("route.pickupLocation", "pickupLocation", "pickupLocation.id = route.pickupLocationId")
        .addSelect(["pickupLocation.formattedAddress", "pickupLocation.name", "pickupLocation.coordinate"])
        .leftJoin("route.destination", "destination", "destination.id = route.destinationId")
        .addSelect(["destination.formattedAddress", "destination.name", "destination.coordinate"])
        .getMany();
      return bookings.map((booking): IAllBookings => {
        return {
          id: booking.id,
          booking_route: {
            pick_up: {
              formatted_address: booking.route.pickupLocation.formattedAddress,
              name: booking.route.pickupLocation.name,
              location: {
                lat: booking.route.pickupLocation.coordinate["coordinates"][1],
                lng: booking.route.pickupLocation.coordinate["coordinates"][0],
              },
            },
            destination: {
              formatted_address: booking.route.destination.formattedAddress,
              name: booking.route.destination.name,
              location: {
                lat: booking.route.destination.coordinate["coordinates"][1],
                lng: booking.route.destination.coordinate["coordinates"][0],
              },
            },
          },
          price: booking.price,
          vehicle_type: booking.vehicleType,
          payment_method: booking.paymentMethod,
          finished_on: booking?.completedOn?.toISOString(),
        };
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getBookingDetail(bookingId: string): Promise<IBookingDetail> {
    try {
      const booking = await this.bookingRepository
        .createQueryBuilder("booking")
        .where("booking.id = :id", { id: bookingId })
        .andWhere(
          new Brackets((qb) => {
            qb.where("booking.status = :completed", { completed: BookingStatus.COMPLETED }).orWhere(
              "booking.status = :cancelled",
              { cancelled: BookingStatus.CANCELLED }
            );
          })
        )
        .select([
          "booking.id",
          "booking.driverId",
          "booking.paymentMethod",
          "booking.started_on",
          "booking.completedOn",
          "booking.price",
          "booking.vehicleType",
          "booking.driverRating",
          "booking.passengerRating",
          "booking.phone",
          "booking.name",
          "booking.status",
        ])
        .leftJoin("booking.driver", "driver")
        .addSelect(["driver.fullName", "driver.avatar"])
        .leftJoin("booking.route", "route")
        .addSelect(["route.id"])
        .leftJoin("route.pickupLocation", "pickupLocation", "pickupLocation.id = route.pickupLocationId")
        .addSelect(["pickupLocation.formattedAddress", "pickupLocation.name", "pickupLocation.coordinate"])
        .leftJoin("route.destination", "destination", "destination.id = route.destinationId")
        .addSelect(["destination.formattedAddress", "destination.name", "destination.coordinate"])
        .getOne();
      if (!booking) {
        throw new NotFoundException("Booking not found");
      }
      return {
        id: booking.id,
        driver: {
          name: booking?.driver?.fullName,
          avatar: booking?.driver?.avatar,
        },
        booking_route: {
          pick_up: {
            formatted_address: booking.route.pickupLocation.formattedAddress,
            name: booking.route.pickupLocation.name,
            location: {
              lat: booking.route.pickupLocation.coordinate["coordinates"][1],
              lng: booking.route.pickupLocation.coordinate["coordinates"][0],
            },
          },
          destination: {
            formatted_address: booking.route.destination.formattedAddress,
            name: booking.route.destination.name,
            location: {
              lat: booking.route.destination.coordinate["coordinates"][1],
              lng: booking.route.destination.coordinate["coordinates"][0],
            },
          },
        },
        phone: booking.phone,
        name: booking.name,
        passenger_rating: booking.passengerRating,
        driver_rating: booking.driverRating,
        price: booking.price,
        vehicle_type: booking.vehicleType,
        payment_method: booking.paymentMethod,
        started_on: booking?.startedOn?.toISOString(),
        finished_on: booking?.completedOn?.toISOString(),
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  mapToCurrentBookingUser(
    booking: Booking,
    driver_vehicle: DriverVehicle,
    booking_route: IBookingRoute
  ): ICurrentBookingUser {
    return {
      id: booking.id,
      booking_route,
      driver: {
        name: booking?.driver?.fullName,
        phone: booking?.driver?.phone,
        avatar: booking?.driver?.avatar,
        plate: driver_vehicle?.plate,
        description: driver_vehicle?.description,
      },
      status: booking.status,
      payment_method: booking.paymentMethod,
      vehicle_type: booking?.vehicleType,
      price: booking.price,
    };
  }

  mapToCurrentBookingDriver(booking: Booking, booking_route: IBookingRoute): ICurrentBookingDriver {
    return {
      id: booking.id,
      booking_route,
      name: booking?.name,
      phone: booking?.phone,
      status: booking.status,
      payment_method: booking.paymentMethod,
      vehicle_type: booking?.vehicleType,
      price: booking.price,
    };
  }

  getPriceByDistance(distance: number) {
    //distance in meters
    return {
      motorbike:
        VehicleTypePrice.MOTORBIKE.FIRST_2_KM +
        (Math.max(0, distance - 2000) / 1000) * VehicleTypePrice.MOTORBIKE.NEXT_PER_KM,
      car4:
        VehicleTypePrice.CAR4.FIRST_2_KM + (Math.max(0, distance - 2000) / 1000) * VehicleTypePrice.CAR4.NEXT_PER_KM,
      car7:
        VehicleTypePrice.CAR7.FIRST_2_KM + (Math.max(0, distance - 2000) / 1000) * VehicleTypePrice.CAR7.NEXT_PER_KM,
    };
  }
}
