import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableBookings1714827900131 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS bookings (
                id UUID PRIMARY KEY,
                booking_route_id UUID NOT NULL,
                driver_id UUID NOT NULL,
                ordered_by_id UUID NOT NULL,
                phone VARCHAR(10),
                created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                created_by UUID NOT NULL,
                updated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_by UUID NOT NULL,
                started_on TIMESTAMP,
                completed_on TIMESTAMP,
                driver_rating INT DEFAULT 0,
                passenger_rating INT DEFAULT 0,
                price DECIMAL NOT NULL DEFAULT 0,
                payment_method varchar NOT NULL DEFAULT 'CARD' CHECK (payment_method IN ('CARD', 'CASH')),
                vehicle_type VARCHAR(255) NOT NULL DEFAULT '',
                transaction_id UUID NOT NULL,
                status varchar not NULL DEFAULT 'pending' check (status IN ('PENDING', 'ACCEPTED', 'PICKED_UP', 'IN_PROGRESS', 'ARRIVED', 'COMPLETED', 'REJECTED', 'CANCELLED'))
            )`
    );

    await queryRunner.query(
      `ALTER TABLE bookings ADD CONSTRAINT fk_booking_route_id FOREIGN KEY (booking_route_id) REFERENCES bookings_route (id)`
    );
    await queryRunner.query(
      `ALTER TABLE bookings ADD CONSTRAINT fk_driver_id FOREIGN KEY (driver_id) REFERENCES users (id)`
    );
    await queryRunner.query(
      `ALTER TABLE bookings ADD CONSTRAINT fk_ordered_by_id FOREIGN KEY (ordered_by_id) REFERENCES users (id)`
    );
    await queryRunner.query(
      `ALTER TABLE bookings ADD CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES users (id)`
    );
    await queryRunner.query(
      `ALTER TABLE bookings ADD CONSTRAINT fk_updated_by FOREIGN KEY (updated_by) REFERENCES users (id)`
    );
    await queryRunner.query(
      `ALTER TABLE bookings ADD CONSTRAINT fk_transaction_id FOREIGN KEY (transaction_id) REFERENCES transactions (id)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
