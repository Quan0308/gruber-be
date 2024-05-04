import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableUsers1714062528722 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE users (
        id uuid PRIMARY KEY,
        full_name varchar(255) DEFAULT NULL,
        phone varchar(10) UNIQUE DEFAULT NULL,
        avatar varchar(512) DEFAULT NULL,
        role varchar NOT NULL DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER', 'DRIVER')),
        firebase_uid varchar NOT NULL,
        created_on timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_on timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        confirmed boolean NOT NULL DEFAULT FALSE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
