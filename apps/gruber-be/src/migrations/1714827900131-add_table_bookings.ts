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
            name: "phone",
            type: "varchar",
            length: "10",
            isNullable: true,
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
            isNullable: false,
            default: "'card'",
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
            isNullable: false,
          },
          {
            name: "status",
            type: "enum",
            enum: ["pending", "accepted", "picked_up", "in_progress", "arrived", "completed", "rejected", "cancelled"],
            isNullable: false,
            default: "'pending'",
          },
        ],
      })
    );
    const foreignBookingRouteId = new TableForeignKey({
      columnNames: ["booking_route_id"],
      referencedColumnNames: ["id"],
      referencedTableName: "bookings_route",
    });
    const foreignDriverId = new TableForeignKey({
      columnNames: ["driver_id"],
      referencedColumnNames: ["id"],
      referencedTableName: "users",
    });
    const foreignOrderedById = new TableForeignKey({
      columnNames: ["ordered_by_id"],
      referencedColumnNames: ["id"],
      referencedTableName: "users",
    });
    const foreignCreatedBy = new TableForeignKey({
      columnNames: ["created_by"],
      referencedColumnNames: ["id"],
      referencedTableName: "users",
    });
    const foreignUpdatedBy = new TableForeignKey({
      columnNames: ["updated_by"],
      referencedColumnNames: ["id"],
      referencedTableName: "users",
    });
    const foreignTransactionId = new TableForeignKey({
      columnNames: ["transaction_id"],
      referencedColumnNames: ["id"],
      referencedTableName: "transactions",
    });
    await queryRunner.createForeignKey("bookings", foreignBookingRouteId);
    await queryRunner.createForeignKey("bookings", foreignDriverId);
    await queryRunner.createForeignKey("bookings", foreignOrderedById);
    await queryRunner.createForeignKey("bookings", foreignCreatedBy);
    await queryRunner.createForeignKey("bookings", foreignUpdatedBy);
    await queryRunner.createForeignKey("bookings", foreignTransactionId);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
