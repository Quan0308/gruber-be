import { ILocation } from "./location.interface";

export interface IBookingRoute {
  pick_up: ILocation;
  destination: ILocation;
}
