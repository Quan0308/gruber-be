import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddTableDriversInfo1714976333229 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "drivers_info",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
          {
            name: "driver_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "driver_identification",
            type: "varchar",
            length: "12",
            isNullable: true,
            default: null,
          },
          {
            name: "vehicle_plate",
            type: "varchar",
            length: "15",
            isNullable: true,
            default: null,
          },
          {
            name: "vehicle_type",
            type: "enum",
            enum: ["car4", "car7", "motorbike"],
            isNullable: true,
            default: null,
          },
          {
            name: "vehicle_description",
            type: "varchar",
            length: "255",
            isNullable: true,
            default: null,
          },
          {
            name: "credit_wallet_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "cash_wallet_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "activity_status",
            type: "enum",
            enum: ["online", "offline", "busy"],
            default: "'online'",
          },
          {
            name: "is_validated",
            type: "boolean",
            default: false,
          },
        ],
        foreignKeys: [
          {
            name: "FK_DRIVERS_INFO_DRIVER_ID",
            columnNames: ["driver_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
          },
          {
            name: "FK_DRIVERS_INFO_CREDIT_WALLET_ID",
            columnNames: ["credit_wallet_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "wallets",
          },
          {
            name: "FK_DRIVERS_INFO_CASH_WALLET_ID",
            columnNames: ["cash_wallet_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "wallets",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
