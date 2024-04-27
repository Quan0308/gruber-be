import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableUsers1714062528722 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE users (
        id uuid PRIMARY KEY,
        full_name varchar(255) NOT NULL,
        phone varchar(10) UNIQUE,
        avatar varchar(512),
        role varchar NOT NULL DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER', 'DRIVER')),
        firebase_uid varchar NOT NULL,
        created_on timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_on timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE users
    `);
  }
}