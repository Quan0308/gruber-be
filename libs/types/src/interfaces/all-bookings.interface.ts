import { PaymentMethod } from "../enums";
import { IBookingRoute } from "./booking-route.interface";

export interface IAllBookings {
  id: string;
  booking_route: IBookingRoute;
  finished_on: string;
  payment_method: PaymentMethod;
  vehicle_type: string;
  price: number;
}
