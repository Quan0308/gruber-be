import { BookingStatus, PaymentMethod } from "../enums";
import { IBookingRoute } from "./booking-route.interface";

export interface IAllBookings {
  id: string;
  booking_route: IBookingRoute;
  status?: BookingStatus;
  finished_on?: string;
  driverId?: string;
  payment_method: PaymentMethod;
  vehicle_type: string;
  price: number;
}
