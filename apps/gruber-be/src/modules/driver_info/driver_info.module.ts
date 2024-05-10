import { Module } from "@nestjs/common";
import { DriverInfoService } from "./driver_info.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DriverInfor } from "@db/entities";
import { WalletModule } from "../wallet/wallet.module";

@Module({
  imports: [WalletModule, TypeOrmModule.forFeature([DriverInfor])],
  providers: [DriverInfoService],
  exports: [DriverInfoService],
})
export class DriverInfoModule {}
