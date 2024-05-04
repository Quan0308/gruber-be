import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableTransactions1714796630347 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY,
        owner_id UUID NOT NULL,
        amount DECIMAL NOT NULL DEFAULT 0,
        transaction_date TIMESTAMP NOT NULL,
        status VARCHAR(10) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
        description VARCHAR(255) DEFAULT NULL,
        sender_name VARCHAR(255) DEFAULT NULL,
        receiver_name VARCHAR(255) DEFAULT NULL
      )`
    );

    await queryRunner.query(
      `ALTER TABLE transactions ADD CONSTRAINT fk_user_id FOREIGN KEY (owner_id) REFERENCES users (id)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
