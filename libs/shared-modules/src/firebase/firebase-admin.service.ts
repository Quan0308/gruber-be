import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { AxiosInstance } from "axios";
import { App, AppOptions, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { genericHttpConsumer } from "@utils"
import { ConfigService } from "@nestjs/config";
import { FirebaseErrorCodeEnum } from "@types";
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
            returnSecureToken: true
        })
    }

    async createNewUser(email: string, password: string) {
        return this.httpService.post(`${this.authDomain}/accounts:signUp?key=${this.apiKey}`, {
            email,
            password,
            returnSecureToken: true
        })
    }

    async verifyToken(token: string) {
        try{
        const auth = getAuth(this.app);
        return auth.verifyIdToken(token);
        } catch (error) {
            if(error.code === FirebaseErrorCodeEnum.TOKEN_EXPIRED) {
                return new UnauthorizedException(error.message);
            }
            throw error;
        }
    }
}
