import { Body, Controller, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { RouteService } from "./route.service";
import { CreateRouteDto } from "@dtos";

@Controller("route")
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Post()
  @HttpCode(200)
  async createRoute(@Body() data: CreateRouteDto) {
    return await this.routeService.createRoute(data);
  }

  @Get()
  async getAllRoutes() {
    return await this.routeService.getAllRoutes();
  }

  @Get("nearby")
  async getRoutesNearby(@Query("long") long: number, @Query("lat") lat: number) {
    return await this.routeService.getRoutesNearby(long, lat);
  }
}
