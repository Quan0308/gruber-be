import { ICurrentBookingUser } from "./current-booking-user.interface";

export interface ICurrentBookingDriver extends Omit<ICurrentBookingUser, "driver"> {
  name: string;
  phone: string;
}
