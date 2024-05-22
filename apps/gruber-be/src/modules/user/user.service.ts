import { User } from "@db/entities/user.entity";
import { MakeTransactionDto, UpdateCurrentLocation, UpdateUserGeneralInfoDto } from "@dtos";
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Point, Repository } from "typeorm";
import { DriverInfoService } from "../driver_info/driver_info.service";
import { RoleEnum } from "@types";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly driverInfoService: DriverInfoService
  ) {}

  async getUserById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async updateCurrentLocation(position: UpdateCurrentLocation, id: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException("User not found");
      }
      const pointObject: Point = {
        type: "Point",
        coordinates: [position.lng, position.lat],
      };
      user.currentLocation = pointObject;
      return this.userRepository.save(user);
    } catch (ex) {
      throw new InternalServerErrorException(ex.message);
    }
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
      const users = await this.userRepository
        .createQueryBuilder("user")
        .where("user.role = :role", { role: RoleEnum.DRIVER })
        .select(["user.id", "user.fullName", "user.phone", "user.avatar"])
        .leftJoin("user.driverInfor", "driverInfor")
        .addSelect(["driverInfor.id", "driverInfor.activityStatus", "driverInfor.isValidated"])
        .leftJoin("driverInfor.driverVehicle", "vehicle")
        .addSelect(["vehicle.id", "vehicle.plate", "vehicle.description", "vehicle.type"])
        .getMany();

      return users.map((user) => {
        // return {
        //   id: user.id,
        //   fullName: user.fullName,
        //   phone: user.phone,
        //   avatar: user.avatar,
        //   activityStatus: user.driverInfor.activityStatus,
        //   isValidated: user.driverInfor.isValidated,
        //   vehicle_type: user.driverInfor.driverVehicle?.type,
        //   vehicle_plate: user.driverInfor.driverVehicle?.plate,
        //   vehicle_description: user.driverInfor.driverVehicle?.description,
        // };
      });
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
      const user = await this.userRepository.findOne({ where: { id } });
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
