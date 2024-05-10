import { Body, Controller, Get, Patch, Param, Query, Post, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { BookingService } from "../booking/booking.service";
import { CardInfoService } from "../card_info/card_info.service";
import { CreateVehicleDto, MakeTransactionDto, UpdateUserGeneralInfoDto } from "@dtos";
import { RoleEnum } from "@types";
import { DriverInfoService } from "../driver_info/driver_info.service";

@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly bookingService: BookingService,
    private readonly cardInfoService: CardInfoService,
    private readonly driverInfoService: DriverInfoService
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

  @Get(":id/wallets")
  async getWallets(@Param("id") id: string) {
    return await this.userService.getWallets(id);
  }

  @Post(":id/wallets")
  async makeTransaction(@Param("id") id: string, @Body(new ValidationPipe()) data: MakeTransactionDto) {
    return await this.userService.makeTransactionWallet(id, data);
  }

  @Patch(":id/general-info")
  async updateUserGeneralInfo(@Param("id") id: string, @Body() data: UpdateUserGeneralInfoDto) {
    return await this.userService.updateUserGeneralInfo(id, data);
  }

  @Patch(":id/validate")
  async validateDriver(@Param("id") id: string) {
    return await this.userService.validateDriver(id);
  }

  @Post(":id/vehicle")
  async createDriverVehicle(@Param("id") id: string, @Body() data: CreateVehicleDto) {
    await this.driverInfoService.createDriverVehicle(data, id);
    return await this.driverInfoService.updateDriverVehicle(id);
  }

  @Get(":id/vehicle")
  async getDriverVehicle(@Param("id") id: string) {
    return await this.driverInfoService.getDriverVehicleByDriverId(id);
  }
}
