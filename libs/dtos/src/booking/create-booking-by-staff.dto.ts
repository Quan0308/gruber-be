import { IsEmpty, IsNotEmpty, IsObject, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateBookingByStaffDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  driver_id: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsPhoneNumber("VN")
  phone: string;

  @IsNotEmpty()
  @IsString()
  vehicle_type: string;

  @IsNotEmpty()
  @IsObject()
  booking_route: {
    pick_up: string;
    destination: string;
  };
}
