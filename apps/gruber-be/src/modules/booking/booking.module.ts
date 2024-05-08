import { Module, forwardRef } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { Booking, BookingRoute, LocationRecord, User } from "@db/entities";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BookingController } from "./booking.controller";
import { LocationModule } from "../location/location.module";
import { BookingRouteModule } from "../booking_route/booking-route.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    forwardRef(() => UserModule),
    LocationModule,
    BookingRouteModule,
    TypeOrmModule.forFeature([Booking, BookingRoute, LocationRecord, User]),
  ],
  providers: [BookingService],
  controllers: [BookingController],
  exports: [BookingService],
})
export class BookingModule {}
