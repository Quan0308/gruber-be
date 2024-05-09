import { IsNotEmpty } from "class-validator";
import { CreateLocationDto } from "../location";

export class CreateRouteDto {
  @IsNotEmpty()
  from: CreateLocationDto;

  @IsNotEmpty()
  to: CreateLocationDto;
}
