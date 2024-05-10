import { ActivityStatus } from "@types";
import { BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DriverVehicle } from "./driver-vehicle.entity";
import { Wallet } from "./wallet.entity";

@Entity({ name: "drivers_info" })
export class DriverInfor extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "driver_id", type: "uuid", nullable: false })
  driverId: string;

  @Column({ name: "driver_idenfication", type: "varchar", length: 12, nullable: false })
  driverIdenfication: string;

  @Column({ name: "vehicle_id", type: "uuid", nullable: false })
  vehicleId: string;

  @Column({ name: "credit_wallet_id", type: "uuid", nullable: false })
  creditWalletId: string;

  @Column({ name: "cash_wallet_id", type: "uuid", nullable: false })
  cashWalletId: string;

  @Column({
    name: "activity_status",
    type: "enum",
    enum: ActivityStatus,
    default: ActivityStatus.ONLINE,
  })
  activityStatus: ActivityStatus;

  @Column({ name: "is_validated", type: "boolean", default: false })
  isValidated: boolean;

  @OneToOne(() => DriverVehicle)
  driverVehicle: DriverVehicle;

  @OneToOne(() => Wallet)
  creditWallet: Wallet;

  @OneToOne(() => Wallet)
  cashWallet: Wallet;
}
