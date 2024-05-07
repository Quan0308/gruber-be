import { BookingRoute } from "@db/entities";
import { CreateRouteDto } from "@dtos";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LocationService } from "../location/location.service";

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
}
