import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

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
            isNullable: false,
          },
          {
            name: "vehicle_id",
            type: "uuid",
            isNullable: false,
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
      })
    );
    const foreignDriver = new TableForeignKey({
      columnNames: ["driver_id"],
      referencedColumnNames: ["id"],
      referencedTableName: "users",
    });
    const foreignVehicle = new TableForeignKey({
      columnNames: ["vehicle_id"],
      referencedColumnNames: ["id"],
      referencedTableName: "driver_vehicles",
    });
    const foreignCreditWallet = new TableForeignKey({
      columnNames: ["credit_wallet_id"],
      referencedColumnNames: ["id"],
      referencedTableName: "wallets",
    });
    const foreignCashWallet = new TableForeignKey({
      columnNames: ["cash_wallet_id"],
      referencedColumnNames: ["id"],
      referencedTableName: "wallets",
    });
    await queryRunner.createForeignKey("drivers_info", foreignDriver);
    await queryRunner.createForeignKey("drivers_info", foreignVehicle);
    await queryRunner.createForeignKey("drivers_info", foreignCreditWallet);
    await queryRunner.createForeignKey("drivers_info", foreignCashWallet);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
