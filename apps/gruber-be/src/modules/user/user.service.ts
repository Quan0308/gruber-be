import { User } from "@db/entities/user.entity";
import { UpdateUserGeneralInfoDto } from "@dtos";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DriverInfor } from "@db/entities/drivers_info.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(DriverInfor)
    private driverInforRepostiory: Repository<DriverInfor>
  ) {}
  async getUserById(id: string) {
    return await this.userRepository.findOne({ where: { id } });
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
      const driver = await this.driverInforRepostiory.findOne({ where: { driverId } });
      if (!driver) {
        throw new NotFoundException("Driver not found");
      }
      driver.isValidated = !driver.isValidated;
      return await this.driverInforRepostiory.save(driver);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
