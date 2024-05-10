import { Module, forwardRef } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@db/entities";
import { BookingModule } from "../booking/booking.module";
import { DriverInfoModule } from "../driver_info/driver_info.module";
import { CardInfoModule } from "../card_info/card_info.module";

@Module({
  imports: [
    DriverInfoModule,
    forwardRef(() => BookingModule),
    forwardRef(() => CardInfoModule),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
