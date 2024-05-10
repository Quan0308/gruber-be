import { DriverInfor } from "@db/entities/drivers_info.entity";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { WalletService } from "../wallet/wallet.service";
import { WalletType } from "@types";
import { NotFoundException, InternalServerErrorException } from "@nestjs/common";

import { DriverVehicle } from "@db/entities";
import { VehicleService } from "../vehicle/vehicle.service";
import { CreateVehicleDto } from "@dtos";

@Injectable()
export class DriverInfoService {
  constructor(
    @InjectRepository(DriverInfor)
    private driverInforRepository: Repository<DriverInfor>,
    private readonly walletService: WalletService,
    private readonly vehicleService: VehicleService
  ) {}

  async createDriverInfo(driver_id: string) {
    const creditWallet = await this.walletService.createWallet(WalletType.CREDIT);
    const cashWallet = await this.walletService.createWallet(WalletType.CASH);

    const driverInfo = this.driverInforRepository.create({
      driverId: driver_id,
      creditWalletId: creditWallet.id,
      cashWalletId: cashWallet.id,
    });

    return await this.driverInforRepository.save(driverInfo);
  }

  async updateDriverVehicle(driver_id: string) {
    const [driver, vehicle] = await Promise.all([
      this.driverInforRepository.findOne({ where: { driverId: driver_id } }),
      this.vehicleService.getVehicleByOwnerId(driver_id),
    ]);

    if (!driver || !vehicle) {
      throw new NotFoundException(!driver ? "Driver not found" : "Vehicle not found");
    }

    return this.driverInforRepository.save({ ...driver, vehicleId: vehicle.id });
  }

  async createDriverVehicle(data: CreateVehicleDto, driver_id: string) {
    const driver = await this.driverInforRepository.findOne({ where: { driverId: driver_id } });
    if (!driver) {
      throw new NotFoundException("Driver not found");
    }
    return await this.vehicleService.createVehicle({ ...data, ownerId: driver_id });
  }

  async validateDriver(driverId: string) {
    try {
      const driver = await this.driverInforRepository.findOne({ where: { driverId } });
      if (!driver) {
        throw new NotFoundException("Driver not found");
      }
      driver.isValidated = !driver.isValidated;
      return await this.driverInforRepository.save(driver);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
