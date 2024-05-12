import { Module } from "@nestjs/common";
import { GruberGateway } from "./gateway.gateway";
import { BookingGateway } from "./booking.gateway";

@Module({
  providers: [GruberGateway, BookingGateway],
  exports: [BookingGateway],
})
export class GatewayModule {}
