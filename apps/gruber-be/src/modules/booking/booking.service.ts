import { Booking } from "@db/entities";
import { CreateAssignBookingDriverMessageDto, CreateBookingByPassengerDto, CreateBookingByStaffDto } from "@dtos";
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UseInterceptors,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";
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
  TransactionType,
  VehicleTypePrice,
  WalletType,
} from "@types";
import { UserService } from "../user/user.service";
import { BookingGateway } from "../gateway/booking.gateway";
import { LocationService } from "../location/location.service";

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private readonly userService: UserService,
    private readonly locationService: LocationService,
    private readonly bookingGateway: BookingGateway
  ) {}

  async createBookingByPassenger(data: CreateBookingByPassengerDto) {
    try {
      const pickUpLocation = await this.locationService.createLocation(data.booking_route.pick_up);
      const destinationLocation = await this.locationService.createLocation(data.booking_route.destination);
      return this.bookingRepository.save({
        orderedById: data.user_id,
        vehicleType: data.vehicle_type,
        pickupLocationId: pickUpLocation.id,
        destinationLocationId: destinationLocation.id,
        status: BookingStatus.PENDING,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async createBookingByStaff(data: CreateBookingByStaffDto) {
    try {
      return this.bookingRepository.save({
        ...data,
        status: BookingStatus.PENDING,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
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
      const newBooking = await this.bookingRepository.save(booking);
      if (
        booking.paymentMethod === PaymentMethod.CARD &&
        (targetStatus === BookingStatus.COMPLETED || targetStatus === BookingStatus.ARRIVED)
      ) {
        this.userService.makeTransactionWallet(booking.driverId, {
          amount: Math.ceil(0.7 * booking.price),
          wallet: WalletType.CASH,
          transaction_type: TransactionType.DEPOSIT,
        });
      } else if (booking.paymentMethod === PaymentMethod.CASH && targetStatus === BookingStatus.COMPLETED) {
        this.userService.makeTransactionWallet(booking.driverId, {
          amount: booking.price - Math.ceil(0.7 * booking.price),
          wallet: WalletType.CREDIT,
          transaction_type: TransactionType.WITHDRAW,
        });
      }
      return newBooking;
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
        .andWhere("booking.status NOT IN (:...status)", { status: [BookingStatus.COMPLETED, BookingStatus.CANCELLED] })
        .orderBy("booking.createdOn", "DESC")
        .select([
          "booking.id",
          "booking.driverId",
          "booking.name",
          "booking.phone",
          "booking.status",
          "booking.paymentMethod",
          "booking.price",
        ])
        .leftJoin("booking.driver", "driver")
        .addSelect(["driver.fullName", "driver.phone", "driver.avatar"])
        .leftJoin("driver.driverInfor", "driverInfor")
        .addSelect(["driverInfor.vehiclePlate", "driverInfor.vehicleDescription", "driverInfor.vehicleType"])
        .leftJoin("booking.pickupLocation", "pickupLocation")
        .addSelect(["pickupLocation.formattedAddress", "pickupLocation.name", "pickupLocation.coordinate"])
        .leftJoin("booking.destinationLocation", "destinationLocation")
        .addSelect([
          "destinationLocation.formattedAddress",
          "destinationLocation.name",
          "destinationLocation.coordinate",
        ])
        .getOne();
      if (!booking) {
        throw new NotFoundException("Booking not found");
      }
      return user.role === RoleEnum.DRIVER
        ? {
            id: booking.id,
            pickUp: {
              formatted_address: booking.pickupLocation.formattedAddress,
              name: booking.pickupLocation.name,
              location: {
                lat: booking.pickupLocation.coordinate["coordinates"][1],
                lng: booking.pickupLocation.coordinate["coordinates"][0],
              },
            },
            destination: {
              formatted_address: booking.destinationLocation.formattedAddress,
              name: booking.destinationLocation.name,
              location: {
                lat: booking.destinationLocation.coordinate["coordinates"][1],
                lng: booking.destinationLocation.coordinate["coordinates"][0],
              },
            },
            name: booking.name,
            phone: booking.phone,
            status: booking.status,
            payment_method: booking.paymentMethod,
            vehicle_type: booking.driver.driverInfor.vehicleType,
            price: booking.price,
          }
        : {
            id: booking.id,
            booking_route: {
              pick_up: {
                formatted_address: booking.pickupLocation.formattedAddress,
                name: booking.pickupLocation.name,
                location: {
                  lat: booking.pickupLocation.coordinate["coordinates"][1],
                  lng: booking.pickupLocation.coordinate["coordinates"][0],
                },
              },
              destination: {
                formatted_address: booking.destinationLocation.formattedAddress,
                name: booking.destinationLocation.name,
                location: {
                  lat: booking.destinationLocation.coordinate["coordinates"][1],
                  lng: booking.destinationLocation.coordinate["coordinates"][0],
                },
              },
            },
            driver: {
              name: booking.driver?.fullName,
              phone: booking.driver?.phone,
              avatar: booking.driver?.avatar,
              plate: booking.driver?.driverInfor?.vehiclePlate,
              description: booking.driver?.driverInfor?.vehicleDescription,
            },
            status: booking.status,
            payment_method: booking.paymentMethod,
            vehicle_type: booking.driver?.driverInfor?.vehicleType,
            price: booking.price,
          };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllBookings(current: boolean): Promise<IAllBookings[]> {
    try {
      const bookings = await this.bookingRepository
        .createQueryBuilder("booking")
        .where(
          new Brackets((qb) => {
            current
              ? qb.where("booking.status NOT IN (:...status)", {
                  status: [BookingStatus.CANCELLED, BookingStatus.COMPLETED],
                })
              : qb.where("", {});
          })
        )
        .select([
          "booking.id",
          "booking.paymentMethod",
          "booking.price",
          "booking.status",
          "booking.completedOn",
          "booking.driverId",
        ])
        .orderBy("booking.createdOn", "DESC")
        .leftJoin("booking.driver", "driver")
        .leftJoin("driver.driverInfor", "driverInfor")
        .addSelect(["driverInfor.vehicleType"])
        .leftJoinAndSelect("booking.pickupLocation", "pickupLocation")
        .leftJoinAndSelect("booking.destinationLocation", "destinationLocation")
        .getMany();
      return bookings.map((booking): IAllBookings => {
        return {
          id: booking.id,
          booking_route: {
            pick_up: {
              formatted_address: booking.pickupLocation.formattedAddress,
              name: booking.pickupLocation.name,
              location: {
                lat: booking.pickupLocation.coordinate["coordinates"][1],
                lng: booking.pickupLocation.coordinate["coordinates"][0],
              },
            },
            destination: {
              formatted_address: booking.destinationLocation.formattedAddress,
              name: booking.destinationLocation.name,
              location: {
                lat: booking.destinationLocation.coordinate["coordinates"][1],
                lng: booking.destinationLocation.coordinate["coordinates"][0],
              },
            },
          },
          driverId: booking.driverId,
          status: booking.status,
          price: booking.price,
          finished_on: booking?.completedOn?.toISOString(),
          vehicle_type: booking.driver.driverInfor.vehicleType,
          payment_method: booking.paymentMethod,
        };
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  // async getAllBookingsByUserId(user_id: string): Promise<IAllBookings[]> {
  //   const user = await this.userService.getUserById(user_id);
  //   try {
  //     const whereClause = user.role === RoleEnum.DRIVER ? { driverId: user_id } : { ordered_by_Id: user_id };
  //     const bookings = await this.bookingRepository
  //       .createQueryBuilder("booking")
  //       .where(whereClause)
  //       .andWhere(
  //         new Brackets((qb) => {
  //           qb.where("booking.status = :completed", { completed: BookingStatus.COMPLETED }).orWhere(
  //             "booking.status = :cancelled",
  //             { cancelled: BookingStatus.CANCELLED }
  //           );
  //         })
  //       )
  //       .select([
  //         "booking.id",
  //         "booking.paymentMethod",
  //         "booking.completedOn",
  //         "booking.price",
  //         "booking.vehicleType",
  //         "booking.status",
  //       ])
  //       .orderBy("booking.createdOn", "DESC")
  //       .leftJoin("booking.route", "route")
  //       .addSelect(["route.id"])
  //       .leftJoin("route.pickupLocation", "pickupLocation", "pickupLocation.id = route.pickupLocationId")
  //       .addSelect(["pickupLocation.formattedAddress", "pickupLocation.name", "pickupLocation.coordinate"])
  //       .leftJoin("route.destination", "destination", "destination.id = route.destinationId")
  //       .addSelect(["destination.formattedAddress", "destination.name", "destination.coordinate"])
  //       .getMany();
  //     return bookings.map((booking): IAllBookings => {
  //       return {
  //         id: booking.id,
  //         booking_route: {
  //           pick_up: {
  //             formatted_address: booking.route.pickupLocation.formattedAddress,
  //             name: booking.route.pickupLocation.name,
  //             location: {
  //               lat: booking.route.pickupLocation.coordinate["coordinates"][1],
  //               lng: booking.route.pickupLocation.coordinate["coordinates"][0],
  //             },
  //           },
  //           destination: {
  //             formatted_address: booking.route.destination.formattedAddress,
  //             name: booking.route.destination.name,
  //             location: {
  //               lat: booking.route.destination.coordinate["coordinates"][1],
  //               lng: booking.route.destination.coordinate["coordinates"][0],
  //             },
  //           },
  //         },
  //         price: booking.price,
  //         vehicle_type: booking.vehicleType,
  //         payment_method: booking.paymentMethod,
  //         finished_on: booking?.completedOn?.toISOString(),
  //       };
  //     });
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }

  // async getBookingDetail(bookingId: string, staff?: boolean): Promise<IBookingDetail> {
  //   try {
  //     const booking = await this.bookingRepository
  //       .createQueryBuilder("booking")
  //       .where("booking.id = :id", { id: bookingId })
  //       .andWhere(
  //         new Brackets((qb) => {
  //           if (staff) {
  //             qb.where("", {});
  //           } else {
  //             qb.where("booking.status = :completed", { completed: BookingStatus.COMPLETED }).orWhere(
  //               "booking.status = :cancelled",
  //               { cancelled: BookingStatus.CANCELLED }
  //             );
  //           }
  //         })
  //       )
  //       .select([
  //         "booking.id",
  //         "booking.driverId",
  //         "booking.paymentMethod",
  //         "booking.startedOn",
  //         "booking.completedOn",
  //         "booking.price",
  //         "booking.vehicleType",
  //         "booking.driverRating",
  //         "booking.passengerRating",
  //         "booking.phone",
  //         "booking.name",
  //         "booking.status",
  //       ])
  //       .leftJoin("booking.driver", "driver")
  //       .addSelect(["driver.fullName", "driver.avatar", "driver.phone"])
  //       .leftJoin("booking.route", "route")
  //       .addSelect(["route.id"])
  //       .leftJoin("route.pickupLocation", "pickupLocation", "pickupLocation.id = route.pickupLocationId")
  //       .addSelect(["pickupLocation.formattedAddress", "pickupLocation.name", "pickupLocation.coordinate"])
  //       .leftJoin("route.destination", "destination", "destination.id = route.destinationId")
  //       .addSelect(["destination.formattedAddress", "destination.name", "destination.coordinate"])
  //       .getOne();
  //     if (!booking) {
  //       throw new NotFoundException("Booking not found");
  //     }
  //     return {
  //       id: booking.id,
  //       driver: {
  //         name: booking.driver?.fullName,
  //         avatar: booking.driver?.avatar,
  //         phone: booking.driver?.phone,
  //       },
  //       booking_route: {
  //         pick_up: {
  //           formatted_address: booking.route.pickupLocation.formattedAddress,
  //           name: booking.route.pickupLocation.name,
  //           location: {
  //             lat: booking.route.pickupLocation.coordinate["coordinates"][1],
  //             lng: booking.route.pickupLocation.coordinate["coordinates"][0],
  //           },
  //         },
  //         destination: {
  //           formatted_address: booking.route.destination.formattedAddress,
  //           name: booking.route.destination.name,
  //           location: {
  //             lat: booking.route.destination.coordinate["coordinates"][1],
  //             lng: booking.route.destination.coordinate["coordinates"][0],
  //           },
  //         },
  //       },
  //       driverId: booking.driverId,
  //       phone: booking.phone,
  //       name: booking.name,
  //       passenger_rating: booking.passengerRating,
  //       driver_rating: booking.driverRating,
  //       price: booking.price,
  //       vehicle_type: booking.vehicleType,
  //       payment_method: booking.paymentMethod,
  //       started_on: booking?.startedOn?.toISOString(),
  //       finished_on: booking?.completedOn?.toISOString(),
  //       status: booking.status,
  //     };
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }

  // async updateBookingDriver(bookingId: string, driverId: string, updatedById: string) {
  //   try {
  //     const booking = await this.bookingRepository.findOne({ where: { id: bookingId } });
  //     const driver = await this.userService.getUserById(driverId);
  //     const user = await this.userService.getUserById(updatedById);
  //     if (booking.driverId !== null) {
  //       throw new BadRequestException("Booking already has a driver");
  //     }
  //     if (!booking || !driver || !user) {
  //       throw new NotFoundException("Booking, driver or user not found");
  //     }
  //     booking.driverId = driverId;
  //     booking.updatedBy = updatedById;
  //     return await this.bookingRepository.save(booking);
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }

  getPriceByDistance(distance: number) {
    //distance in meters
    return {
      motorbike:
        Math.round(
          (VehicleTypePrice.MOTORBIKE.FIRST_2_KM +
            (Math.max(0, distance - 2000) / 1000) * VehicleTypePrice.MOTORBIKE.NEXT_PER_KM) /
            100
        ) * 100,
      car4:
        Math.round(
          (VehicleTypePrice.CAR4.FIRST_2_KM +
            (Math.max(0, distance - 2000) / 1000) * VehicleTypePrice.CAR4.NEXT_PER_KM) /
            100
        ) * 100,
      car7:
        Math.round(
          (VehicleTypePrice.CAR7.FIRST_2_KM +
            (Math.max(0, distance - 2000) / 1000) * VehicleTypePrice.CAR7.NEXT_PER_KM) /
            100
        ) * 100,
    };
  }
}
