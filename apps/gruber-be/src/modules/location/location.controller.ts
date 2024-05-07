import { Body, Controller, Get, HttpCode, Post, Query } from "@nestjs/common";
import { LocationService } from "./location.service";
import { CreateLocationDto } from "@dtos";

@Controller("locations")
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @HttpCode(200)
  async createLocation(@Body() data: CreateLocationDto) {
    return await this.locationService.createLocation(data);
  }

  @Get()
  async getAllLocations() {
    return await this.locationService.getAllLocations();
  }

  @Get("search")
  async getLocationByHint(
    @Query("keyword") keyword: string,
    @Query("limit") limit: number,
    @Query("offset") offset: number
  ) {
    console.log(keyword);
    return await this.locationService.getLocationByHint(keyword, limit, offset);
  }

  @Get("nearby")
  async getLocationNearby(@Query("lng") lng: number, @Query("lat") lat: number) {
    return await this.locationService.getLocationByUnit(lng, lat, 1000);
  }
}
