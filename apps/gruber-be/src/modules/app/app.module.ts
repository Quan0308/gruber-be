import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@db/database.module'

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    DatabaseModule
  ],
  controllers: [AppController],
})
export class AppModule {}
