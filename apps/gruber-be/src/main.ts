/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { TransformResponseInterceptor, ExceptionHandlerInterceptor } from "@utils";
import { AppModule } from "./modules/app/app.module";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./apps/gruber-be/src/cert/key.pem'),
    cert: fs.readFileSync('./apps/gruber-be/src/cert/cert.pem'),
  };
  const app = await NestFactory.create(AppModule);
  const globalPrefix = "api";
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalInterceptors(new TransformResponseInterceptor());
  app.useGlobalInterceptors(new ExceptionHandlerInterceptor());
  const port = process.env.PORT || 3001;
  const options: CorsOptions = {
    origin: "*", // replace with your own origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  };
  app.enableCors(options);
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
