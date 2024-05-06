import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { LocationRecord } from "@entities";

@Entity({ name: "bookings_route" })
export class BookingRoute extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "pickup_location_id", type: "uuid", nullable: false })
  pickupLocationId: string;

  @Column({ name: "destination_id", type: "uuid", nullable: false })
  destinationId: string;

  @ManyToOne(() => LocationRecord)
  pickupLocation: LocationRecord;

  @ManyToOne(() => LocationRecord)
  destination: LocationRecord;
}
