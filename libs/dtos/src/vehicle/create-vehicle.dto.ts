import { IsString, IsNotEmpty, IsEnum } from "class-validator";
import { VehicleType } from "@types";

export class CreateVehicleDto {
  @IsNotEmpty({ message: "Type is required" })
  @IsEnum(VehicleType)
  type: VehicleType;

  @IsNotEmpty({ message: "Plate is required" })
  @IsString()
  plate: string;

  @IsNotEmpty({ message: "Description is required" })
  @IsString()
  description: string;
}
