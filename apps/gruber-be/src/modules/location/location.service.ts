import { LocationRecord } from "@db/entities";
import { CreateLocationDto } from "@dtos";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Point } from "typeorm";

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(LocationRecord)
    private locationRecordRepository: Repository<LocationRecord>
  ) {}

  async createLocation(data: CreateLocationDto) {
    const pointObject: Point = {
      type: "Point",
      coordinates: [data.lng, data.lat],
    };
    const existedLocationCoordinate = await this.getLocationByUnit(data.lng, data.lat, 0.00001);
    return existedLocationCoordinate
      ? existedLocationCoordinate
      : await this.locationRecordRepository.save({
          formattedAddress: data?.formattedAddress,
          name: data?.name,
          coordinate: pointObject,
        });
  }

  async getLocationByUnit(lng: number, lat: number, unit: number) {
    const location: Point = {
      type: "Point",
      coordinates: [lng, lat],
    };
    return this.locationRecordRepository
      .createQueryBuilder("location")
      .where("ST_DWithin(location.coordinate, ST_GeomFromGeoJSON(:location), :unit)", {
        location: JSON.stringify(location),
        unit,
      })
      .getOne(); //coordinates is ordered as [long, lat]
  }

  async getLocationByHint(hint: string, limit: number = 10, offset: number = 0) {
    console.log(hint);
    return await this.locationRecordRepository
      .createQueryBuilder("location")
      .where("location.name LIKE :search", { search: `%${hint}%` })
      .orWhere("location.formattedAddress LIKE :search", { search: `%${hint}%` })
      .skip(offset)
      .take(limit)
      .getMany();
  }

  async getAllLocations() {
    return await this.locationRecordRepository.find(); //coordinates is ordered as [long, lat]
  }

  async getLocationByFormattedAddress(formattedAddress: string) {
    return await this.locationRecordRepository
      .createQueryBuilder("route")
      .where("route.formattedAddress LIKE :search", { search: `%${formattedAddress}%` })
      .getMany();
  }
}
