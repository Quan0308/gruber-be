import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyTransactions21715319577521 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("transactions", "walletId");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
