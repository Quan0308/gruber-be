import { DriverInfor } from "@db/entities/drivers_info.entity";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { WalletService } from "../wallet/wallet.service";
import { WalletType } from "@types";
import { NotFoundException, InternalServerErrorException } from "@nestjs/common";

@Injectable()
export class DriverInfoService {
  constructor(
    @InjectRepository(DriverInfor)
    private driverInforRepository: Repository<DriverInfor>,
    private readonly walletService: WalletService
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
