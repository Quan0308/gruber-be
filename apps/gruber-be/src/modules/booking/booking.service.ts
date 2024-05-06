import { Booking, BookingRoute, LocationRecord, User } from "@db/entities";
import { CreateBookingDto } from "@dtos";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(BookingRoute)
    private bookingRouteRepository: Repository<BookingRoute>,
    @InjectRepository(LocationRecord)
    private locationRecordRepository: Repository<LocationRecord>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}
  async createBooking(data: CreateBookingDto) {
    try {
      const { orderedById, phone } = data;
      if (phone === undefined) {
        const user = await this.userRepository.findOne({ where: { id: orderedById } });
        data = { ...data, phone: user?.phone };
      }
      return await this.bookingRepository.save(data);
    } catch (error) {
      console.log(error);
      return new InternalServerErrorException();
    }
  }
}
