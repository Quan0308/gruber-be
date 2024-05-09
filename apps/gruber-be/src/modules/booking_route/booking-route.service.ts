import { BookingRoute } from "@db/entities";
import { CreateRouteDto } from "@dtos";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Point, Repository } from "typeorm";
import { LocationService } from "../location/location.service";
import { IBookingRoute } from "@types";

@Injectable()
export class BookingRouteService {
  constructor(
    @InjectRepository(BookingRoute)
    private bookingRouteRepository: Repository<BookingRoute>,
    private readonly locationService: LocationService
  ) {}

  async createBookingRoute(data: CreateRouteDto): Promise<BookingRoute> {
    try {
      const { from, to } = data;
      const pickUpLocation = await this.locationService.createLocation(from);
      const destinationLocation = await this.locationService.createLocation(to);
      const newBookingRoute = this.bookingRouteRepository.create({
        pickupLocationId: pickUpLocation.id,
        destinationId: destinationLocation.id,
      });
      return await this.bookingRouteRepository.save(newBookingRoute);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async createBookingRouteByLocationIds(pickupLocationId: string, destinationId: string) {
    const newBookingRoute = this.bookingRouteRepository.create({
      pickupLocationId,
      destinationId,
    });
    return await this.bookingRouteRepository.save(newBookingRoute);
  }

  async getBookingRouteDetails(routeId: string): Promise<IBookingRoute> {
    const location = await this.bookingRouteRepository
      .createQueryBuilder("bookingRoute")
      .where("bookingRoute.id = :id", { id: routeId })
      .select(["bookingRoute.id"])
      .leftJoinAndSelect("bookingRoute.pickupLocation", "pickupLocation")
      .leftJoinAndSelect("bookingRoute.destination", "destination")
      .getOne();

    return this.mapBookingRoute(location);
  }

  private mapBookingRoute(location: BookingRoute): IBookingRoute {
    return {
      pick_up: {
        formatted_address: location.pickupLocation.formattedAddress,
        name: location.pickupLocation.name,
        location: {
          lat: location.pickupLocation.coordinate["coordinates"][1],
          lng: location.pickupLocation.coordinate["coordinates"][0],
        },
      },
      destination: {
        formatted_address: location.destination.formattedAddress,
        name: location.destination.name,
        location: {
          lat: location.destination.coordinate["coordinates"][1],
          lng: location.destination.coordinate["coordinates"][0],
        },
      },
    };
  }

  async getDistanceOfRoute(pickUpLocationId: string, destinationId: string): Promise<number> {
    const pickUpLocation = await this.locationService.getLocationById(pickUpLocationId);
    const destinationLocation = await this.locationService.getLocationById(destinationId);

    const pickUp: Point = {
      type: "Point",
      coordinates: [pickUpLocation.coordinate["coordinates"][0], pickUpLocation.coordinate["coordinates"][1]],
    };
    const destination: Point = {
      type: "Point",
      coordinates: [destinationLocation.coordinate["coordinates"][0], destinationLocation.coordinate["coordinates"][1]],
    };
    const distance = this.locationService.calculateDistanceBetweenTwoLocations(pickUp, destination);
    return parseFloat(distance.toFixed(2));
  }
}
