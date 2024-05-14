import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddTableDriverVehicles1714321508069 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "driver_vehicles",
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
            name: "plate",
            type: "varchar",
            length: "15",
            isUnique: true,
            isNullable: false,
          },
          {
            name: "type",
            type: "varchar",
            length: "255",
            isNullable: true,
            default: null,
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
            name: "FK_DRIVER_VEHICLES_OWNER_ID",
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
