import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

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
          },
          {
            name: "booking_route_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "driver_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "ordered_by_id",
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
            name: "vehicle_type",
            type: "varchar",
            length: "255",
            isNullable: false,
            default: "''",
          },
          {
            name: "transaction_id",
            type: "uuid",
            isNullable: true,
            default: null,
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
            name: "FK_BOOKINGS_BOOKING_ROUTE_ID",
            columnNames: ["booking_route_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "bookings_route",
          },
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
          {
            name: "FK_BOOKINGS_TRANSACTION_ID",
            columnNames: ["transaction_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "transactions",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
