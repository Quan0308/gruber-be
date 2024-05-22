import { Module } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { Booking } from "@db/entities";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BookingController } from "./booking.controller";
import { LocationModule } from "../location/location.module";
import { UserModule } from "../user/user.module";
import { GatewayModule } from "../gateway/gateway.module";

@Module({
  imports: [UserModule, LocationModule, GatewayModule, TypeOrmModule.forFeature([Booking])],
  providers: [BookingService],
  controllers: [BookingController],
  exports: [BookingService],
})
export class BookingModule {}
