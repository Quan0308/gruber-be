import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "@db/database.module";
import { AuthModule } from "../auth/auth.module";
import { RouteModule } from "../route/route.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, AuthModule, RouteModule],
  controllers: [AppController],
})
export class AppModule {}
