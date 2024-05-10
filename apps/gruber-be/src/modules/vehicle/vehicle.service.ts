import { DriverVehicle } from "@db/entities";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { InternalServerErrorException } from "@nestjs/common";

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(DriverVehicle)
    private readonly driverVehicleRepository: Repository<DriverVehicle>
  ) {}

  async getVehicleByOwnerId(ownerId: string) {
    try {
      return await this.driverVehicleRepository.findOne({ where: { ownerId } });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async createVehicle(data: any) {
    try {
      const vehicle = this.driverVehicleRepository.create(data);
      return await this.driverVehicleRepository.save(vehicle);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
