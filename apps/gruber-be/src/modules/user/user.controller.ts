import { Controller, Get, Param } from "@nestjs/common";
import { UserService } from "./user.service";
import { BookingService } from "../booking/booking.service";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService, private readonly bookingService: BookingService) {}

  // allow role driver or passenger
  @Get(":id/current-booking")
  async getCurrentBooking(@Param("id") id: string) {
    return await this.bookingService.getCurrentBookingByUserId(id);
  }
}
