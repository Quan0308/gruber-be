import { Module } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { Booking, DriverVehicle } from "@db/entities";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BookingController } from "./booking.controller";
import { LocationModule } from "../location/location.module";
import { BookingRouteModule } from "../booking_route/booking-route.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [UserModule, LocationModule, BookingRouteModule, TypeOrmModule.forFeature([Booking, DriverVehicle])],
  providers: [BookingService],
  controllers: [BookingController],
  exports: [BookingService],
})
export class BookingModule {}
