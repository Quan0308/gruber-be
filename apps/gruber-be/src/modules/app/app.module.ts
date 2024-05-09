import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "@db/database.module";
import { AuthModule } from "../auth/auth.module";
import { LocationModule } from "../location/location.module";
import { BookingModule } from "../booking/booking.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    LocationModule,
    BookingModule,
    LocationModule,
    UserModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
