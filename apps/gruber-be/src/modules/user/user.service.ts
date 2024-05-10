import { User } from "@db/entities";
import { UpdateUserGeneralInfoDto } from "@dtos";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
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
}
