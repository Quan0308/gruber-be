import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppOptions } from "firebase-admin";
import { cert } from "firebase-admin/app";
import { FirebaseAdminService } from "./firebase-admin.service";

@Module({
    providers: [
        {
            provide: "FIREBASE_ADMIN_OPTIONS_TOKEN",
            inject: [ConfigService],
            useFactory: (configService: ConfigService): AppOptions => ({
                credential: cert({
                    projectId: configService.get("FIREBASE_PROJECT_ID"),
                    clientEmail: configService.get("FIREBASE_CLIENT_EMAIL"),
                    privateKey: configService.get("FIREBASE_PRIVATE_KEY")
                }),
                databaseURL: configService.get("FIREBASE_DATABASE_URL")
            })
        },
        FirebaseAdminService
    ],
    exports: [FirebaseAdminService]
})
export class FirebaseModule {}
