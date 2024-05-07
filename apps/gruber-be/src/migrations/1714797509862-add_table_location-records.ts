import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddTableLocationRecords1714797509862 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS postgis`);
    await queryRunner.createTable(
      new Table({
        name: "location_records",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "formatted_address",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "name",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "coordinate",
            type: "geometry",
            isNullable: false,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
