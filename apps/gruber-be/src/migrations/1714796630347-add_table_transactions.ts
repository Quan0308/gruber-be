import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddTableTransactions1714796630347 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "transactions",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "owner_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "amount",
            type: "decimal",
            isNullable: false,
            default: 0,
          },
          {
            name: "transaction_date",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
          {
            name: "status",
            type: "enum",
            enum: ["pending", "success", "failed"],
            isNullable: false,
            default: "'pending'",
          },
          {
            name: "type",
            type: "enum",
            enum: ["deposit", "withdraw"],
            isNullable: false,
            default: "'deposit'",
          },
          {
            name: "description",
            type: "varchar",
            length: "255",
            isNullable: true,
            default: null,
          },
        ],
        foreignKeys: [
          {
            name: "FK_TRANSACTIONS_OWNER_ID",
            columnNames: ["owner_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
