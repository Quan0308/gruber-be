import { IBookingRoute } from "./booking-route.interface";
import { IDriver } from "./driver.interface";
import { PaymentMethod } from "../enums/payment-method.enum";

export interface ICurrentBookingUser {
  id: string;
  booking_route: IBookingRoute;
  driver: IDriver;
  status: string;
  payment_method: PaymentMethod;
  vehicle_type: string;
  price: number;
}
