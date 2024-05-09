import { IsEnum, IsNotEmpty, IsObject } from "class-validator";
import { CreateLocationDto } from "../location";
import { PaymentMethod } from "@types";
import { Type } from "class-transformer";

class BookingRoute {
  @Type(() => CreateLocationDto)
  pick_up: CreateLocationDto;

  @Type(() => CreateLocationDto)
  destination: CreateLocationDto;
}

export class CreateBookingByPassengerDto {
  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  @IsObject()
  booking_route: BookingRoute;

  @IsNotEmpty()
  vehicle_type: string;

  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;
}
