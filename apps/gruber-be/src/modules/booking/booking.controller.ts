import { Body, Controller, HttpCode, Post, UseGuards, ValidationPipe } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { CreateBookingByPassengerDto, CreateBookingByStaffDto } from "@dtos";
import { AuthGuard } from "@nestjs/passport";
import { CreateBookingValidationPipe } from "@utils";

@Controller("bookings")
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  //@UseGuards(AuthGuard("firebase"))
  @Post()
  @HttpCode(200)
  async createBooking(
    @Body(new CreateBookingValidationPipe()) data: CreateBookingByPassengerDto | CreateBookingByStaffDto
  ) {
    return await this.bookingService.createBooking(data);
  }
}
