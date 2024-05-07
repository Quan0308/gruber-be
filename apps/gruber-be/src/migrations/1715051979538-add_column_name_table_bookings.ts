import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnNameTableBookings1715051979538 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "bookings",
      new TableColumn({
        name: "name",
        type: "varchar",
        length: "255",
        isNullable: true,
        default: null,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
