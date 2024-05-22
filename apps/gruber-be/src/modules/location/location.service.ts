import { LocationRecord } from "@db/entities";
import { CreateLocationDto } from "@dtos";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Point } from "typeorm";

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
      : this.locationRecordRepository.save({
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

  async getLocationByKeyWord(keyword: string, limit: number = 10, offset: number = 0) {
    return await this.locationRecordRepository
      .createQueryBuilder("location")
      .where("LOWER(location.name) ILIKE :search", { search: `%${keyword}%` })
      .orWhere("LOWER(location.formattedAddress) ILIKE :search", { search: `%${keyword}%` })
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

  calculateDistanceBetweenTwoLocations(location1: Point, location2: Point) {
    const toRadian = (angle: number) => (Math.PI / 180) * angle;
    const distance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371; // km
      const dLat = toRadian(lat2 - lat1);
      const dLon = toRadian(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadian(lat1)) * Math.cos(toRadian(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };
    return distance(
      location1.coordinates[1],
      location1.coordinates[0],
      location2.coordinates[1],
      location2.coordinates[0]
    );
  }

  async getLocationById(id: string) {
    try {
      const location = await this.locationRecordRepository.findOne({ where: { id } });
      if (!location) {
        throw new InternalServerErrorException("Location not found");
      }
      return location;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
