import { ActivityStatus, VehicleType } from "@types";
import { BaseEntity, Column, Entity, Geometry, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Wallet } from "./wallet.entity";
import { User } from "./user.entity";

@Entity({ name: "drivers_info" })
export class DriverInfor extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "driver_id", type: "uuid", nullable: false })
  driverId: string;

  @Column({ name: "driver_identification", type: "varchar", length: 12, nullable: true })
  driverIdentification: string;

  @Column({ name: "vehicle_plate", type: "varchar", length: 15, nullable: true })
  vehiclePlate: string;

  @Column({ name: "vehicle_type", type: "enum", enum: VehicleType, nullable: true })
  vehicleType: VehicleType;

  @Column({ name: "vehicle_description", type: "varchar", length: "255", nullable: true })
  vehicleDescription: string;

  @Column({ name: "credit_wallet_id", type: "uuid", nullable: false })
  creditWalletId: string;

  @Column({ name: "cash_wallet_id", type: "uuid", nullable: false })
  cashWalletId: string;

  @Column({
    name: "activity_status",
    type: "enum",
    enum: ActivityStatus,
    default: ActivityStatus.OFFLINE,
  })
  activityStatus: ActivityStatus;

  @Column({ name: "is_validated", type: "boolean", default: false })
  isValidated: boolean;

  @OneToOne(() => Wallet)
  @JoinColumn({ name: "credit_wallet_id", referencedColumnName: "id" })
  readonly creditWallet: Wallet;

  @OneToOne(() => Wallet)
  @JoinColumn({ name: "cash_wallet_id", referencedColumnName: "id" })
  readonly cashWallet: Wallet;

  @OneToOne(() => User)
  @JoinColumn({ name: "driver_id", referencedColumnName: "id" })
  readonly user: User;
}
