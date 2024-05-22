import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import * as dbEntities from "./entities";
import * as dbSubscribers from "./subscribers";

const entities = (Object.keys(dbEntities) as Array<keyof typeof dbEntities>).map((key) => dbEntities[key]);
const subscribers = (Object.keys(dbSubscribers) as Array<keyof typeof dbSubscribers>).map((key) => dbSubscribers[key]);
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DB_HOST"),
        port: configService.get("DB_PORT"),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_DATABASE"),
        entities,
        subscribers,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class DatabaseModule {}
