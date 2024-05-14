import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddTableBookingsRoute1714825971910 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "bookings_route",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "pickup_location_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "destination_id",
            type: "uuid",
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            name: "FK_BOOKINGS_ROUTE_PICKUP_LOCATION_ID",
            columnNames: ["pickup_location_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "location_records",
          },
          {
            name: "FK_BOOKINGS_ROUTE_DESTINATION_ID",
            columnNames: ["destination_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "location_records",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
