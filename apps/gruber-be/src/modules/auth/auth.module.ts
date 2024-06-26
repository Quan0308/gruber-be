import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule } from "@nestjs/config";
import { FirebaseModule, MailModule } from "@shared-modules";
import { AuthService } from "./auth.service";
import { FirebaseStrategy } from "../../strategies/firebase.strategy";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@db/entities";
import { DriverInfoModule } from "../driver_info/driver_info.module";

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    FirebaseModule,
    MailModule,
    DriverInfoModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, FirebaseStrategy],
  exports: [AuthService],
})
export class AuthModule {}
