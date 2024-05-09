import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { FirebaseAdminService, MailService } from "@shared-modules";
import { LoginDto, RegisterDto } from "@dtos";
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

  async registerUser(data: RegisterDto) {
    try {
      const { userRecord, emailVerificationLink } = await this.firebaseAdminService.createNewUser(
        data.email,
        data.password,
        data.role
      );
      await this.userRepository.save({ firebaseUid: userRecord.uid, role: data.role });
      return await this.mailService.sendUserConfirmation(data.email, data.email, emailVerificationLink);
    } catch (ex) {
      switch (ex.response?.error?.message) {
        case "EMAIL_EXISTS":
          return new BadRequestException("Email already exists");
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
