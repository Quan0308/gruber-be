import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { LocationRecord } from "./location_record.entity";
import { Booking } from "./booking.entity";

@Entity({ name: "bookings_route" })
export class BookingRoute extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "pickup_location_id", type: "uuid", nullable: false })
  pickupLocationId: string;

  @Column({ name: "destination_id", type: "uuid", nullable: false })
  destinationId: string;

  @ManyToOne(() => LocationRecord)
  @JoinColumn({ name: "pickup_location_id" })
  pickupLocation: LocationRecord;

  @ManyToOne(() => LocationRecord)
  @JoinColumn({ name: "destination_id" })
  destination: LocationRecord;

  @OneToMany(() => Booking, (booking) => booking.route)
  bookings: Booking[];
}
