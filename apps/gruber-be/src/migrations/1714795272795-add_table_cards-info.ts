import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableCardsInfo1714795272795 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS cards_info (
        id UUID PRIMARY KEY,
        owner_id UUID NOT NULL,
        bank_name VARCHAR(255) NOT NULL,
        card_account_number VARCHAR(20) NOT NULL,
        card_account_name VARCHAR(255) NOT NULL,
        card_expired_date DATE NOT NULL,
        card_cvv VARCHAR(3) NOT NULL,
        phone VARCHAR(10) NOT NULL
      );
    `);
    await queryRunner.query(`
      ALTER TABLE cards_info ADD CONSTRAINT fk_user_id FOREIGN KEY (owner_id) REFERENCES users (id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
