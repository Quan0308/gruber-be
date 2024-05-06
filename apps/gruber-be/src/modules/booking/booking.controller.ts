import { Body, Controller, HttpCode, Post, UseGuards } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { CreateBookingDto } from "@dtos";
import { AuthGuard } from "@nestjs/passport";

@Controller("bookings")
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(AuthGuard("firebase"))
  @Post()
  @HttpCode(200)
  async createBooking(@Body() data: CreateBookingDto) {
    return await this.bookingService.createBooking(data);
  }
}
