import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  Geometry,
} from "typeorm";
import { RoleEnum } from "@types";
import { Booking } from "./booking.entity";
import { CardInfo } from "./card_info.entity";
import { DriverInfor } from "./drivers_info.entity";
import { Transaction } from "./transaction.entity";

@Entity({ name: "users" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "full_name", type: "varchar", length: 255, nullable: true })
  fullName: string;

  @Column({ name: "phone", type: "varchar", length: 10, unique: true, nullable: true, default: null })
  phone: string;

  @Column({ name: "avatar", type: "varchar", nullable: true, default: null })
  avatar: string;

  @Column({ name: "role", type: "enum", enum: RoleEnum, default: RoleEnum.PASSENGER })
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

  @Column({
    name: "current_location",
    type: "geometry",
    nullable: true,
    spatialFeatureType: "Point",
    srid: 4326,
    default: null,
  })
  currentLocation: Geometry;

  @OneToOne(() => CardInfo)
  readonly cardInfo: CardInfo;

  @OneToMany(() => Booking, (booking) => booking.driver)
  readonly bookings: Booking[];

  @OneToMany(() => Booking, (booking) => booking.order)
  readonly orders: Booking[];

  @OneToOne(() => DriverInfor, (driverInfor) => driverInfor.user)
  readonly driverInfor: DriverInfor;

  @OneToMany(() => Transaction, (transaction) => transaction.owner)
  readonly transactions: Transaction[];
}
