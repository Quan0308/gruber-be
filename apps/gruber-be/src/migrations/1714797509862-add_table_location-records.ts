import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableLocationRecords1714797509862 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS postgis`);
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS location_records (
        id uuid PRIMARY KEY,
        formatted_address VARCHAR(255) NOT NULL,
        coordinate geometry NOT NULL
      )`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
