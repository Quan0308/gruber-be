import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "@db/database.module";
import { AuthModule } from "../auth/auth.module";
import { LocationModule } from "../location/location.module";
import { BookingModule } from "../booking/booking.module";
import { UserModule } from "../user/user.module";
import { DriverInfoModule } from "../driver_info/driver_info.module";
import { WalletModule } from "../wallet/wallet.module";
import { CardInfoModule } from "../card_info/card_info.module";
import { VehicleModule } from "../vehicle/vehicle.module";
import { GatewayModule } from "../gateway/gateway.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    LocationModule,
    BookingModule,
    LocationModule,
    UserModule,
    DriverInfoModule,
    WalletModule,
    CardInfoModule,
    VehicleModule,
    GatewayModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
