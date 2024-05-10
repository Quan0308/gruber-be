import { Body, Controller, Get, Patch, Param, Query, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { BookingService } from "../booking/booking.service";
import { CardInfoService } from "../card_info/card_info.service";
import { CreateCardInfoDto, UpdateUserGeneralInfoDto } from "@dtos";
import { RoleEnum } from "@types";

@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly bookingService: BookingService,
    private readonly cardInfoService: CardInfoService
  ) {}

  // allow role driver or passenger
  @Get(":id/bookings")
  async getAllBookings(@Param("id") id: string) {
    return await this.bookingService.getAllBookings(id);
  }

  @Get(":id/bookings/:bookingId")
  async getBookingById(@Param("id") id: string, @Param("bookingId") bookingId: string) {
    return await this.bookingService.getBookingDetail(bookingId);
  }

  @Get(":id/current-booking")
  async getCurrentBooking(@Param("id") id: string) {
    return await this.bookingService.getCurrentBookingByUserId(id);
  }

  @Get(":id")
  async getUserById(@Param("id") id: string) {
    return await this.userService.getUserById(id);
  }

  @Get()
  async getUsersByRole(@Query("role") role: RoleEnum) {
    return await this.userService.getUsersByParams({ role });
  }

  @Get(":id/card-info")
  async getCardInfo(@Param("id") id: string) {
    return await this.cardInfoService.getCardInfoByOwnerId(id);
  }

  @Patch(":id/general-info")
  async updateUserGeneralInfo(@Param("id") id: string, @Body() data: UpdateUserGeneralInfoDto) {
    return await this.userService.updateUserGeneralInfo(id, data);
  }

  @Patch(":id/validate")
  async validateDriver(@Param("id") id: string) {
    return await this.userService.validateDriver(id);
  }
}
