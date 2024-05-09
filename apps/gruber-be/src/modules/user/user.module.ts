import { Module, forwardRef } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, DriverInfor } from "@db/entities";
import { BookingModule } from "../booking/booking.module";

@Module({
  imports: [forwardRef(() => BookingModule), TypeOrmModule.forFeature([User, DriverInfor])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
