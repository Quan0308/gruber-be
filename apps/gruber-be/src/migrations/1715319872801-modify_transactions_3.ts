import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyTransactions31715319872801 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.dropColumn("bookings", "transactionId");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
