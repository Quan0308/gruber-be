import { Booking, DriverVehicle } from "@db/entities";
import { CreateBookingByPassengerDto, CreateBookingByStaffDto } from "@dtos";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { BookingRouteService } from "../booking_route/booking-route.service";
import {
  BookingStatus,
  IBookingRoute,
  ICurrentBookingDriver,
  ICurrentBookingUser,
  PaymentMethod,
  RoleEnum,
} from "@types";
import { plainToClass } from "class-transformer";
import { UserService } from "../user/user.service";

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(DriverVehicle)
    private driverVehicleRepository: Repository<DriverVehicle>,
    private readonly userService: UserService,
    private readonly bookingRouteService: BookingRouteService
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
      return await this.bookingRepository.save({
        ordered_by_Id: user_id,
        name,
        phone,
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
      return await this.bookingRepository.save({
        ordered_by_Id: user_id,
        driverId: driver_id,
        name,
        phone,
        bookingRouteId: route.id,
        vehicleType: vehicle_type,
        createdBy: user_id,
        updatedBy: user_id,
        paymentMethod: PaymentMethod.CASH,
      });
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
          booking.completedOn = new Date(new Date().toISOString());
          break;
        case BookingStatus.PICKED_UP:
          booking.startedOn = new Date(new Date().toISOString());
          break;
        case BookingStatus.COMPLETED:
          booking.completedOn = new Date(new Date().toISOString());
          break;
        default:
          break;
      }
      booking.status = targetStatus;
      booking.updatedBy = updatedById;
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

  async getAllBookings() {
    try {
      return await this.bookingRepository.find({
        where: { status: Not(BookingStatus.COMPLETED) },
        order: { createdOn: "DESC" },
      });
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
}
