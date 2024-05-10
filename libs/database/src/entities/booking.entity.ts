import { BookingStatus, PaymentMethod, RoleEnum } from "@types";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  BeforeUpdate,
  JoinColumn,
  OneToOne,
} from "typeorm";

import { User } from "./user.entity";
import { Transaction } from "./transaction.entity";
import { BookingRoute } from "./booking_route.entity";
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

  @Column({ name: "name", type: "varchar", length: 255, nullable: true, default: null })
  name: string;

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

  @Column({ name: "status", type: "enum", enum: BookingStatus, nullable: false, default: BookingStatus.PENDING })
  status: BookingStatus;

  @OneToOne(() => BookingRoute)
  @JoinColumn({ name: "booking_route_id" })
  route: BookingRoute;

  @ManyToOne(() => User)
  @JoinColumn({ name: "driver_id" })
  driver: User;

  @ManyToOne(() => User)
  order: User;

  @ManyToOne(() => User)
  createdByUser: User;

  @ManyToOne(() => User)
  updatedByUser: User;

  @BeforeUpdate()
  async checkDriverRole() {
    if (!this.driverId) return;
    const driver = await User.findOne({ where: { id: this.driverId } });
    if (!driver || driver.role !== RoleEnum.DRIVER) {
      throw new Error("Driver not found");
    }
  }
}
