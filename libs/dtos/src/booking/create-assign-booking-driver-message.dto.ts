import { ILocation, MessageBooking } from "@types";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateAssignBookingDriverMessageDto {
  @IsString()
  booking_id: string;

  @IsString()
  driver_id: string;

  @IsNotEmpty()
  booking_route: {
    pick_up: ILocation;
    destination: ILocation;
  };

  @IsEnum(MessageBooking)
  message: MessageBooking;
}
