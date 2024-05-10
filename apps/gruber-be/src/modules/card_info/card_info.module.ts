import { Module, forwardRef } from "@nestjs/common";
import { CardInfoService } from "./card_info.service";
import { CardInfo } from "@db/entities";
import { CardInfoController } from "./card_info.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../user/user.module";

@Module({
  imports: [forwardRef(() => UserModule), TypeOrmModule.forFeature([CardInfo])],
  providers: [CardInfoService],
  controllers: [CardInfoController],
  exports: [CardInfoService],
})
export class CardInfoModule {}
