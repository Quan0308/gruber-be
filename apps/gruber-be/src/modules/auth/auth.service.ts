import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { FirebaseAdminService, MailService } from "@shared-modules";
import { LoginDto, RegisterDto } from "@dtos";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@db/entities";
import { Repository } from "typeorm";
import { DriverInfoService } from "../driver_info/driver_info.service";
@Injectable()
export class AuthService {
  constructor(
    private readonly firebaseAdminService: FirebaseAdminService,
    private readonly mailService: MailService,
    private readonly driverInfoService: DriverInfoService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async registerUser(data: RegisterDto) {
    try {
      const { userRecord, emailVerificationLink } = await this.firebaseAdminService.createNewUser(
        data.email,
        data.password,
        data.role
      );
      const driver = await this.userRepository.save({ firebaseUid: userRecord.uid, role: data.role });
      if (data.role === "driver") {
        await this.driverInfoService.createDriverInfo(driver.id);
      }
      return await this.mailService.sendUserConfirmation(data.email, data.email, emailVerificationLink);
    } catch (ex) {
      switch (ex.response?.error?.message) {
        case "EMAIL_EXISTS":
          throw new BadRequestException("Email already exists");
      }
      throw new InternalServerErrorException(ex.response.error?.message);
    }
  }

  async verifyUser(data: LoginDto) {
    try {
      const user = await this.firebaseAdminService.verifyUser(data.email, data.password);
      const isVerifiedEmail = await this.firebaseAdminService.checkVerifiedEmail(user.data.localId);
      if (!isVerifiedEmail) {
        const emailVerificationLink = await this.firebaseAdminService.generateEmailVerificationLink(data.email);
        await this.mailService.sendUserConfirmation(data.email, user.data.displayName, emailVerificationLink);
        return new BadRequestException("Please confirm your email");
      }
      const userEntity = await this.userRepository.findOne({ where: { firebaseUid: user.data.localId } });
      return { id: userEntity.id, ...user.data };
    } catch (ex) {
      if (ex.response.error.message === "INVALID_LOGIN_CREDENTIALS") {
        throw new BadRequestException("Invalid login credentials");
      }
      throw new InternalServerErrorException(ex.response.error.message);
    }
  }

  async verifyFirebaseToken(token: string) {
    return await this.firebaseAdminService.verifyToken(token);
  }
}
