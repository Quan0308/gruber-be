import { BookingStatus, MessageBooking } from "@types";
import { IsEnum, IsString } from "class-validator";

export class updateBookingStatusDataSocketDto {
  @IsString()
  created_by: string;

  @IsEnum(BookingStatus)
  status: BookingStatus;

  @IsString()
  message: MessageBooking;
}
