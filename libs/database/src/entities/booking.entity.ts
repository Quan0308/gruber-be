import { BookingStatus, PaymentMethod } from "@types";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from "typeorm";
import { User, Transaction } from "@entities";

@Entity({ name: "bookings" })
export class Booking extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "booking_route_id", type: "uuid", nullable: false })
  bookingRouteId: string;

  @Column({ name: "driver_id", type: "uuid", nullable: true, default: null })
  driverId: string;

  @Column({ name: "ordered_by_id", type: "uuid", nullable: false })
  ordered_by_Id: string;

  @Column({ name: "phone", type: "varchar", length: 10, nullable: true, default: null })
  phone: string;

  @CreateDateColumn({ name: "created_on", type: "timestamp", default: () => "CURRENT_TIMESTAMP", precision: null })
  createdOn: Date;

  @Column({ name: "created_by", type: "uuid", nullable: false })
  createdBy: string;

  @UpdateDateColumn({
    name: "updated_on",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
    precision: null,
  })
  updatedOn: Date;

  @Column({ name: "updated_by", type: "uuid", nullable: false })
  updatedBy: string;

  @Column({ name: "started_on", type: "timestamp", nullable: true, default: null })
  startedOn: Date;

  @Column({ name: "completed_on", type: "timestamp", nullable: true, default: null })
  completedOn: Date;

  @Column({ name: "driver_rating", type: "int", nullable: true, default: 0 })
  driverRating: number;

  @Column({ name: "passenger_rating", type: "int", nullable: true, default: 0 })
  passengerRating: number;

  @Column({ name: "price", type: "decimal", nullable: false, default: 0 })
  price: number;

  @Column({ name: "payment_method", type: "enum", enum: PaymentMethod, nullable: false, default: PaymentMethod.CARD })
  paymentMethod: PaymentMethod;

  @Column({ name: "vehicle_type", type: "varchar", length: 255, nullable: false, default: "" })
  vehicleType: string;

  @Column({ name: "transaction_id", type: "uuid", nullable: true, default: null })
  transactionId: string;

  @Column({ name: "status", type: "enum", enum: BookingStatus, nullable: false, default: BookingStatus.PENDING })
  status: BookingStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: "driver_id", referencedColumnName: "id" })
  driver: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: "ordered_by_id", referencedColumnName: "id" })
  order: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by", referencedColumnName: "id" })
  createdByUser: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: "updated_by", referencedColumnName: "id" })
  updatedByUser: User;

  @ManyToOne(() => Transaction)
  @JoinColumn({ name: "transaction_id", referencedColumnName: "id" })
  transaction: Transaction;
}
