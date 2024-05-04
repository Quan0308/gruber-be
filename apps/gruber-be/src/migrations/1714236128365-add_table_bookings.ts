import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableBookings1714236128365 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`CREATE TABLE "bookings" (
            "id" uuid PRIMARY KEY,
            "booking_info_id" uuid NOT NULL,
            "driver_id" uuid NOT NULL,
            "order_by_id" uuid NOT NULL,
            "created_on" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "rating" int,
            "comment" text,
            "status" character varying NOT NULL DEFAULT 'pending'
        )`);
    queryRunner.query(
      `ALTER TABLE "bookings" ADD CONSTRAINT "fk_driver_id" FOREIGN KEY (driver_id) REFERENCES "users" (id)`
    );
    queryRunner.query(
      `ALTER TABLE "bookings" ADD CONSTRAINT "fk_order_by_id" FOREIGN KEY (order_by_id) REFERENCES "users" (id)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
