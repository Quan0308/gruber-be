import { User } from "@db/index";
import { Injectable } from "@nestjs/common";
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
}
