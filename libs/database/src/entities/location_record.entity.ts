import { BaseEntity, Column, Entity, Geometry, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "location_records" })
export class LocationRecord extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "formatted_address", type: "varchar", length: 255, nullable: false })
  formattedAddress: string;

  @Column({ name: "name", type: "varchar", length: 255, nullable: true, default: null })
  name: string;

  @Column({ name: "coordinate", type: "geometry", nullable: false })
  coordinate: Geometry;
}
