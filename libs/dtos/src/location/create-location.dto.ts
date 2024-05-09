import { IsDecimal, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateLocationDto {
  @IsNotEmpty()
  @IsString()
  formattedAddress: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsDecimal()
  lat: number;

  @IsNotEmpty()
  @IsDecimal()
  lng: number;
}
