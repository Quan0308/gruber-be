import { Module } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { Booking, BookingRoute, LocationRecord, User } from "@db/entities";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BookingController } from "./booking.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Booking, BookingRoute, LocationRecord, User])],
  providers: [BookingService],
  controllers: [BookingController],
})
export class BookingModule {}
