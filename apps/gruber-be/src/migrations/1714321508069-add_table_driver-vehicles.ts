import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableDriverVehicles1714321508069 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS driver_vehicles (
                id UUID PRIMARY KEY,
                owner_id UUID NOT NULL,
                plate VARCHAR(15) NOT NULL UNIQUE,
                type TEXT DEFAULT NULL,
                description TEXT DEFAULT NULL
            );
        `);
    await queryRunner.query(`
            ALTER TABLE driver_vehicles ADD CONSTRAINT fk_owner_id FOREIGN KEY (owner_id) REFERENCES users (id);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
