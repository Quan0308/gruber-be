import { Module } from "@nestjs/common";
import { LocationController } from "./location.controller";
import { LocationService } from "./location.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LocationRecord } from "@db/entities";

@Module({
  imports: [TypeOrmModule.forFeature([LocationRecord])],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
