import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class AddTableCreditWalletsInfo1714974171691 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "wallets",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "amount",
            type: "decimal",
            isNullable: false,
            default: 0,
          },
          {
            name: "transaction_id",
            type: "uuid",
          },
          {
            name: "type",
            type: "enum",
            enum: ["credit", "cash"],
            isNullable: false,
            default: "'cash'",
          },
        ],
      })
    );
    const foreignKey = new TableForeignKey({
      columnNames: ["transaction_id"],
      referencedColumnNames: ["id"],
      referencedTableName: "transactions",
    });
    await queryRunner.createForeignKey("wallets", foreignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
