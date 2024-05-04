import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableBookingsRoute1714825971910 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS bookings_route (
            id UUID PRIMARY KEY,
            pickup_location_id UUID NOT NULL,
            destination_id UUID NOT NULL
        )`
    );
    await queryRunner.query(
      `ALTER TABLE bookings_route ADD CONSTRAINT fk_pickup_location_id FOREIGN KEY (pickup_location_id) REFERENCES location_records(id)`
    );
    await queryRunner.query(
      `ALTER TABLE bookings_route ADD CONSTRAINT fk_destination_id FOREIGN KEY (destination_id) REFERENCES location_records(id)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
