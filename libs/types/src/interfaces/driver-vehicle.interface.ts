import { VehicleType } from "../enums";

export class IDriverVehicle {
  ownerId: string;
  plate: string;
  type: VehicleType;
  description: string;
}
