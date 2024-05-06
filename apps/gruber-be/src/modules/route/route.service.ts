import { LocationRecord } from "@db/entities";
import { CreateRouteDto } from "@dtos";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Point } from "typeorm";

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(LocationRecord)
    private locationRecordRepository: Repository<LocationRecord>
  ) {}

  async createRoute(data: CreateRouteDto) {
    const pointObject: Point = {
      type: "Point",
      coordinates: [data.long, data.lat],
    };
    const newEntity = this.locationRecordRepository.create({
      formattedAddress: data.formattedAddress,
      coordinate: pointObject,
    });
    return await this.locationRecordRepository.save(newEntity);
  }

  async getRoutesNearby(long: number, lat: number) {
    const location: Point = {
      type: "Point",
      coordinates: [long, lat],
    };
    return this.locationRecordRepository
      .createQueryBuilder("route")
      .where("ST_DWithin(route.coordinate, ST_GeomFromGeoJSON(:location), 1000)", {
        location: JSON.stringify(location),
      })
      .getMany(); //coordinates is ordered as [long, lat]
  }

  async getAllRoutes() {
    return await this.locationRecordRepository.find(); //coordinates is ordered as [long, lat]
  }

  async getRouteByFormattedAddress(formattedAddress: string) {
    return await this.locationRecordRepository
      .createQueryBuilder("route")
      .where("route.formattedAddress LIKE :search", { search: `%${formattedAddress}%` })
      .getMany();
  }
}
