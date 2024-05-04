import { BaseEntity, Column, Entity, Geography, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "location_records" })
export class LocationRecord extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "formatted_address", type: "varchar", length: 255, nullable: false })
  formattedAddress: string;

  @Column({ name: "coordinate", type: "geometry", nullable: false })
  coordinate: Geography;
}
