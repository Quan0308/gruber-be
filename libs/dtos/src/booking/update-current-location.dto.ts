import { IsLatitude, IsLongitude } from "class-validator";

export class UpdateCurrentLocation {
  @IsLatitude()
  lat: number;

  @IsLongitude()
  lng: number;
}
