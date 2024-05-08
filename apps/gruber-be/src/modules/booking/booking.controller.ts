import { Body, Controller, HttpCode, Param, Patch, Post } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { CreateBookingByPassengerDto, CreateBookingByStaffDto } from "@dtos";
import { AuthGuard } from "@nestjs/passport";
import { CreateBookingValidationPipe } from "@utils";
import { BookingStatus } from "@types";

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

  @Patch(":id/status")
  @HttpCode(200)
  async updateBookingStatus(
    @Param("id") id: string,
    @Body("status") status: BookingStatus,
    @Body("updated_by_id") updatedById: string
  ) {
    return await this.bookingService.updateBookingStatus(id, status, updatedById);
  }
}
