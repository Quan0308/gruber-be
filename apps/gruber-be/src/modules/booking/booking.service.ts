import { Booking } from "@db/entities";
import { CreateBookingByPassengerDto, CreateBookingByStaffDto } from "@dtos";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BookingRouteService } from "../booking_route/booking-route.service";
import { BookingStatus, PaymentMethod, RoleEnum } from "@types";
import { plainToClass } from "class-transformer";
import { UserService } from "../user/user.service";

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
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

  async updateBookingStatus(bookingId: string, status: BookingStatus, updatedById: string) {
    try {
      const booking = await this.bookingRepository.findOne({ where: { id: bookingId } });
      if (!booking) {
        throw new NotFoundException("Booking not found");
      }
      switch (status) {
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
      booking.status = status;
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
      const booking =
        user.role === RoleEnum.DRIVER
          ? await this.bookingRepository.findOne({ where: { driverId: userId }, order: { createdOn: "DESC" } })
          : await this.bookingRepository.findOne({ where: { ordered_by_Id: userId }, order: { createdOn: "DESC" } });
      return booking?.status !== BookingStatus.COMPLETED ? booking : null;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
