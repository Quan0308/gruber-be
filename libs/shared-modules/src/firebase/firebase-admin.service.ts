import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { AxiosInstance } from "axios";
import { App, AppOptions, initializeApp } from "firebase-admin/app";
import { genericHttpConsumer } from "@utils";
import { ConfigService } from "@nestjs/config";
import { FirebaseErrorCodeEnum, RoleEnum } from "@types";
import * as admin from "firebase-admin";
@Injectable()
export class FirebaseAdminService {
  private readonly app: App;
  private apiKey: string;
  private authDomain: string;
  private httpService: AxiosInstance = genericHttpConsumer();

  constructor(
    @Inject("FIREBASE_ADMIN_OPTIONS_TOKEN") readonly options: AppOptions,
    private readonly configService: ConfigService
  ) {
    this.apiKey = this.configService.get("FIREBASE_API_KEY");
    this.authDomain = this.configService.get("FIREBASE_AUTH_DOMAIN");
    this.app = initializeApp(options);
  }

  async verifyUser(email: string, password: string) {
    return this.httpService.post(`${this.authDomain}/accounts:signInWithPassword?key=${this.apiKey}`, {
      email,
      password,
      returnSecureToken: true,
    });
  }

  async createNewUser(email: string, password: string, role: RoleEnum = RoleEnum.PASSENGER) {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });
    await admin.auth().setCustomUserClaims(userRecord.uid, { role });
    const emailVerificationLink = await this.generateEmailVerificationLink(email);
    return { userRecord, emailVerificationLink };
  }

  async verifyToken(idtoken: string) {
    try {
      await admin
        .auth()
        .verifyIdToken(idtoken)
        .then((claims) => {
          console.log(claims?.role);
        });
    } catch (error) {
      if (error.code === FirebaseErrorCodeEnum.TOKEN_EXPIRED) {
        return new UnauthorizedException(error.message);
      }
      throw error;
    }
  }

  async checkVerifiedEmail(uid: string) {
    const user = await admin.auth().getUser(uid);
    return user.emailVerified;
  }

  async generateEmailVerificationLink(email: string) {
    return admin.auth().generateEmailVerificationLink(email);
  }
}
