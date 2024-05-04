import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { FirebaseAdminService, MailService } from "@shared-modules";
import { LoginDto } from "@dtos";
import { IVerifyFirebaseResponse } from "@types";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@db/entities";
import { Repository } from "typeorm";
@Injectable()
export class AuthService {
  constructor(
    private readonly firebaseAdminService: FirebaseAdminService,
    private readonly mailService: MailService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async registerUser(data: LoginDto) {
    let registerResponse: IVerifyFirebaseResponse;
    try {
      const result = await this.firebaseAdminService.createNewUser(data.email, data.password);
      registerResponse = result.data;
      const newUser = await this.userRepository.save({ firebaseUid: result.data.localId });
      return await this.mailService.sendUserConfirmation(newUser.id, registerResponse.idToken, data.email);
    } catch (ex) {
      switch (ex.response?.error?.message) {
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
      const user = await this.userRepository.findOne({ where: { firebaseUid: verifyResponse.localId } });
      if (!user.confirmed) {
        await this.mailService.sendUserConfirmation(user.id, verifyResponse.localId, data.email);
        return new BadRequestException("Please confirm your email");
      }
      return verifyResponse;
    } catch (ex) {
      switch (ex.response.error.message) {
        case "EMAIL_NOT_FOUND":
          return new NotFoundException("Email not found");
        case "INVALID_PASSWORD":
          return new BadRequestException("Invalid password");
      }
      throw new InternalServerErrorException(ex.response.error.message);
    }
  }

  async verifyFirebaseToken(token: string) {
    return this.firebaseAdminService.verifyToken(token);
  }

  async verifyEmail(id: string, token: string) {
    try {
      const result = await this.firebaseAdminService.verifyToken(token);
      if (result) {
        const user = await this.userRepository.findOne({ where: { id } });
        await this.userRepository.save({
          ...user,
          confirmed: true,
        });
        return true;
      }
      return false;
    } catch (ex) {
      return false;
    }
  }
}
