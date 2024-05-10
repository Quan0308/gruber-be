import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class ModifyTransactions1715318124904 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("bookings", "transaction_id");
    await queryRunner.dropColumn("wallets", "transaction_id");
    await queryRunner.dropColumn("transactions", "description");
    await queryRunner.dropColumn("transactions", "status");
    await queryRunner.dropColumn("transactions", "type");
    await queryRunner.addColumn(
      "transactions",
      new TableColumn({ name: "sender", type: "varchar", length: "20", isNullable: false })
    );
    await queryRunner.addColumn(
      "transactions",
      new TableColumn({ name: "receiver", type: "varchar", length: "20", isNullable: false })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
