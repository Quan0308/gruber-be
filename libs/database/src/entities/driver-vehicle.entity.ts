import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "dribver_vehicles" })
export class DriverVehicle extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "owner_id", type: "uuid", nullable: false })
  ownerId: string;

  @Column({ name: "plate", type: "varchar", length: 15, nullable: false, unique: true })
  plate: string;

  @Column({ name: "type", type: "text", nullable: true, default: null })
  type: string;

  @Column({ name: "description", type: "text", nullable: true, default: null })
  description: string;
}
