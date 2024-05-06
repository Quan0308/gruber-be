import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

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
      })
    );
    const foreignKeyPickup = new TableForeignKey({
      columnNames: ["pickup_location_id"],
      referencedColumnNames: ["id"],
      referencedTableName: "location_records",
    });
    const foreignKeyDestination = new TableForeignKey({
      columnNames: ["destination_id"],
      referencedColumnNames: ["id"],
      referencedTableName: "location_records",
    });
    await queryRunner.createForeignKey("bookings_route", foreignKeyPickup);
    await queryRunner.createForeignKey("bookings_route", foreignKeyDestination);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
