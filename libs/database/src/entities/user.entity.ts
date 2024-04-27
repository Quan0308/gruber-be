import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { RoleEnum } from "@types";
import { Booking } from "./booking.entity";

@Entity({ name: "users" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "full_name", type: "varchar", length: 255, nullable: false })
  fullName: string;

  @Column({ name: "phone", type: "varchar", length: 10, unique: true, nullable: true, default: null })
  phone: string;

  @Column({ name: "avatar", type: "varchar", nullable: true, default: null })
  avatar: string;

  @Column({ name: "role", type: "enum", enum: RoleEnum, nullable: false, default: RoleEnum.USER })
  role: RoleEnum;

  @Column({ name: "firebase_uid", nullable: false })
  firebaseUid: string;

  @CreateDateColumn({ name: "created_on", type: "timestamp", default: () => "CURRENT_TIMESTAMP", precision: null })
  createdOn: Date;

  @UpdateDateColumn({
    name: "updated_on",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
    precision: null,
  })
  updatedOn: Date;

  @OneToMany(() => Booking, (booking) => booking.driver)
  bookings: Booking[];

  @OneToMany(() => Booking, (booking) => booking.order)
  orders: Booking[];
}