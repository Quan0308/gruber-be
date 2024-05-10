import { Module } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Wallet } from "@db/entities";

@Module({
  imports: [TypeOrmModule.forFeature([Wallet])],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
