import { Module } from "@nestjs/common";
import { RouteController } from "./route.controller";
import { RouteService } from "./route.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LocationRecord } from "@db/entities";

@Module({
  imports: [TypeOrmModule.forFeature([LocationRecord])],
  controllers: [RouteController],
  providers: [RouteService],
})
export class RouteModule {}
