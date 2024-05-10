import { User } from "@db/entities/user.entity";
import { MakeTransactionDto, UpdateUserGeneralInfoDto } from "@dtos";
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DriverInfoService } from "../driver_info/driver_info.service";
import { RoleEnum, TransactionType, WalletType } from "@types";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly driverInfoService: DriverInfoService
  ) {}
  async getUserById(id: string) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async getDriverVehicleByUserId(userId: string) {
    return await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.driverInfor", "driverInfor")
      .leftJoinAndSelect("driverInfor.vehicleId", "vehicle")
      .where("user.id = :userId", { userId })
      .getOne();
  }

  async getUsersByParams(params: any) {
    if (params.role == "admin") return [];
    if (params.role == "driver") {
      const users = await this.userRepository.find({
        where: params,
        relations: ["driverInfor"],
      });

      return users.map((user) => ({
        id: user.id,
        fullName: user.fullName,
        phone: user.phone,
        isValidated: user.driverInfor?.isValidated,
        vehicleId: user.driverInfor?.vehicleId,
      }));
    }
  }

  async getWallets(id: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException("User not found");
      }
      if (user.role != RoleEnum.DRIVER) {
        throw new BadRequestException("Only driver can have wallets");
      }
      return await this.driverInfoService.getWalletsByDriverId(user.id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async makeTransactionWallet(id: string, transaction: MakeTransactionDto) {
    try {
      const user = await this.userRepository.findOne({ where: { id }});
      if (!user) {
        throw new NotFoundException("User not found");
      }
      if (user.role != RoleEnum.DRIVER) {
        throw new BadRequestException("Only driver can have wallets and withdraw");
      }
      return await this.driverInfoService.transact(user.id, transaction);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateUserGeneralInfo(id: string, data: UpdateUserGeneralInfoDto) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException("User not found");
      }
      user.fullName = data.fullName;
      user.phone = data.phone;
      return await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async validateDriver(driverId: string) {
    try {
      const driver = await this.userRepository.findOne({ where: { id: driverId } });
      if (!driver) {
        throw new NotFoundException("Driver not found");
      }
      return this.driverInfoService.validateDriver(driverId);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
