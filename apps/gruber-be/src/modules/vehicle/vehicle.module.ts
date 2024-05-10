import { Module } from "@nestjs/common";
import { VehicleService } from "./vehicle.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DriverVehicle } from "@db/entities";

@Module({
  imports: [TypeOrmModule.forFeature([DriverVehicle])],
  providers: [VehicleService],
  exports: [VehicleService],
})
export class VehicleModule {}
