import { IsNotEmpty, IsPhoneNumber } from "class-validator";

export class CreateBookingDto {
  @IsNotEmpty()
  driverId: string;

  @IsNotEmpty()
  orderedById: string;

  @IsNotEmpty()
  routeId: string;

  @IsPhoneNumber("VN")
  phone?: string;
}
