import { Module } from "@nestjs/common";
import { GruberGateway } from "./gateway.gateway";

@Module({
  providers: [GruberGateway],
})
export class GatewayModule {}
