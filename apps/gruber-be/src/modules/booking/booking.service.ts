import { Booking, User } from "@db/entities";
import { CreateBookingByPassengerDto, CreateBookingByStaffDto } from "@dtos";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BookingRouteService } from "../booking_route/booking-route.service";
import { PaymentMethod, RoleEnum } from "@types";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly bookingRouteService: BookingRouteService
  ) {}

  async createBooking(data: CreateBookingByPassengerDto | CreateBookingByStaffDto) {
    const { user_id } = data;
    const user = await this.userRepository.findOne({ where: { id: user_id } });
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
      const driver = await this.userRepository.findOne({ where: { id: driver_id } });
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
}
