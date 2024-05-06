import { IsDecimal, IsNotEmpty, IsString } from "class-validator";

export class CreateRouteDto {
  @IsString()
  formattedAddress: string;

  @IsNotEmpty()
  @IsDecimal()
  lat: number;

  @IsNotEmpty()
  @IsDecimal()
  long: number;
}
