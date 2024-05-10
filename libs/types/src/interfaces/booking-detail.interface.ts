import { IAllBookings } from "./all-bookings.interface";
import { IDriver } from "./driver.interface";

export interface IBookingDetail extends IAllBookings {
  driver: Omit<IDriver, "phone" | "plate" | "description">;
  phone: string;
  name: string;
  started_on: string;
  driver_rating: number;
  passenger_rating: number;
}
