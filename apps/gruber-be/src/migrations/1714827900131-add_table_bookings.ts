import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddTableBookings1714827900131 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "bookings",
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
            isNullable: true,
          },
          {
            name: "ordered_by_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "pickup_location_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "destination_location_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "name",
            type: "varchar",
            length: "255",
            isNullable: true,
            default: null,
          },
          {
            name: "phone",
            type: "varchar",
            length: "10",
            isNullable: true,
            default: null,
          },
          {
            name: "created_on",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
          {
            name: "created_by",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "updated_on",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
          {
            name: "updated_by",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "started_on",
            type: "timestamp",
            isNullable: true,
            default: null,
          },
          {
            name: "completed_on",
            type: "timestamp",
            isNullable: true,
            default: null,
          },
          {
            name: "driver_rating",
            type: "int",
            default: 0,
          },
          {
            name: "passenger_rating",
            type: "int",
            default: 0,
          },
          {
            name: "price",
            type: "decimal",
            isNullable: false,
            default: 0,
          },
          {
            name: "payment_method",
            type: "enum",
            enum: ["card", "cash"],
            isNullable: true,
            default: "null",
          },
          {
            name: "status",
            type: "enum",
            enum: ["pending", "accepted", "picked_up", "in_progress", "arrived", "completed", "rejected", "cancelled"],
            isNullable: false,
            default: "'pending'",
          },
        ],
        foreignKeys: [
          {
            name: "FK_BOOKINGS_DRIVER_ID",
            columnNames: ["driver_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
          },
          {
            name: "FK_BOOKINGS_ORDERED_BY_ID",
            columnNames: ["ordered_by_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
          },
          {
            name: "FK_BOOKINGS_PICKUP_LOCATION_ID",
            columnNames: ["pickup_location_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "location_records",
          },
          {
            name: "FK_BOOKINGS_DESTINATION_LOCATION_ID",
            columnNames: ["destination_location_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "location_records",
          },
          {
            name: "FK_BOOKINGS_CREATED_BY",
            columnNames: ["created_by"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
          },
          {
            name: "FK_BOOKINGS_UPDATED_BY",
            columnNames: ["updated_by"],
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
