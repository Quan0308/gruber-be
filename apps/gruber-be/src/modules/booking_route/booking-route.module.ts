import { Module } from "@nestjs/common";
import { BookingRouteService } from "./booking-route.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BookingRoute } from "@db/entities";
import { LocationModule } from "../location/location.module";

@Module({
  imports: [LocationModule, TypeOrmModule.forFeature([BookingRoute])],
  providers: [BookingRouteService],
  exports: [BookingRouteService],
})
export class BookingRouteModule {}
