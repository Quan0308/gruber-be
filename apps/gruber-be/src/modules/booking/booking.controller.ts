import { Body, Controller, Get, HttpCode, Param, Patch, Post, Query } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { CreateBookingByPassengerDto, CreateBookingByStaffDto } from "@dtos";
import { CreateBookingValidationPipe } from "@utils";
import { BookingStatus } from "@types";

@Controller("bookings")
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get("price")
  getVehicleTypePrice(@Query("distance") distance: number) {
    return this.bookingService.getPriceByDistance(distance);
  }

  @Get(":id")
  getBookingDetail(@Param("id") id: string){
    return this.bookingService.getBookingDetail(id, true);
  }

  @Get()
  getAllBookingsByUserId(@Query("current") current: boolean) {
    return this.bookingService.getAllBookings(current);
  }

  //@Use
  // Guards(AuthGuard("firebase"))
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

  @Patch(":id/driver")
  @HttpCode(200)
  async updateBookingDriver(
    @Param("id") id: string,
    @Body("driver_id") driverId: string,
    @Body("updated_by_id") updatedById: string
  ) {
    return await this.bookingService.updateBookingDriver(id, driverId, updatedById);
  }
}
