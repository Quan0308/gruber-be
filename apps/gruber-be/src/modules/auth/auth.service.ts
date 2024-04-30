import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { FirebaseAdminService } from "@shared-modules";
import { LoginDto } from "@dtos";
import { IVerifyFirebaseResponse } from "@types";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@db/entities";
import { Repository } from "typeorm";
@Injectable()
export class AuthService {
  constructor(
    private readonly firebaseAdminService: FirebaseAdminService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async registerUser(data: LoginDto) {
    let registerResponse: IVerifyFirebaseResponse;
    try {
      const result = await this.firebaseAdminService.createNewUser(data.email, data.password);
      registerResponse = result.data;
      await this.userRepository.save({ firebaseUid: result.data.localId });
      return registerResponse;
    } catch (ex) {
      switch (ex.response.error?.message) {
        case "EMAIL_EXISTS":
          return new BadRequestException("Email already exists");
      }
      throw new InternalServerErrorException(ex.response.error?.message);
    }
  }

  async verifyUser(data: LoginDto) {
    let verifyResponse: IVerifyFirebaseResponse;
    try {
      const result = await this.firebaseAdminService.verifyUser(data.email, data.password);
      verifyResponse = result.data;
    } catch (error) {
      switch (error.response.error.message) {
        case "EMAIL_NOT_FOUND":
          return new NotFoundException("Email not found");
        case "INVALID_PASSWORD":
          return new BadRequestException("Invalid password");
      }
      throw new InternalServerErrorException(error.response.error.message);
    }
    return verifyResponse;
  }

  async verifyFirebaseToken(token: string) {
    return this.firebaseAdminService.verifyToken(token);
  }
}
