import { BookingStatus } from "@types";
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "./user.entity";

@Entity({ name: "bookings" })
export class Booking extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "booking_info_id", type: "uuid", nullable: false })
  bookingInfoId: string;

  @Column({ name: "driver_id", type: "uuid", nullable: false })
  driverId: string;

  @Column({ name: "order_by_id", type: "uuid", nullable: false })
  orderById: string;

  @CreateDateColumn({ name: "created_on", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdOn: Date;

  @Column({ name: "rating", type: "int", nullable: true })
  rating: number;

  @Column({ name: "commnet", type: "text", nullable: true })
  comment: string;

  @Column({ name: "status", type: "enum", enum: BookingStatus, nullable: false, default: "pending" })
  status: BookingStatus;

  @ManyToOne(() => User, (user) => user.bookings)
  driver: User;

  @ManyToOne(() => User, (user) => user.bookings)
  order: User;
}
