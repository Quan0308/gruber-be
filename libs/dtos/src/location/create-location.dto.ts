import { IsDecimal, IsNotEmpty, IsString } from "class-validator";

export class CreateLocationDto {
  @IsString()
  formattedAddress?: string;

  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsDecimal()
  lat: number;

  @IsNotEmpty()
  @IsDecimal()
  long: number;
}
