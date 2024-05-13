import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class ModifyTableDriversInfo1715316736367 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      "drivers_info",
      "driver_identification",
      new TableColumn({
        name: "driver_identification",
        type: "varchar",
        length: "12",
        isNullable: true,
      })
    );
    await queryRunner.changeColumn(
      "drivers_info",
      "vehicle_id",
      new TableColumn({
        name: "vehicle_id",
        type: "uuid",
        isNullable: true,
      })
    );
    await queryRunner.changeColumn(
      "drivers_info",
      "activity_status",
      new TableColumn({
        name: "activity_status",
        type: "enum",
        enum: ["online", "offline", "busy"],
        default: "'offline'",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse the changes made in the up method
    await queryRunner.changeColumn(
      "drivers_info",
      "driver_identification",
      new TableColumn({
        name: "driver_identification",
        type: "varchar",
        length: "12",
        isNullable: false,
      })
    );
    await queryRunner.changeColumn(
      "drivers_info",
      "vehicle_id",
      new TableColumn({
        name: "vehicle_id",
        type: "uuid",
        isNullable: false,
      })
    );
    await queryRunner.changeColumn(
      "drivers_info",
      "activity_status",
      new TableColumn({
        name: "activity_status",
        type: "enum",
        enum: ["online", "offline", "busy"],
        default: "'online'",
      })
    );
  }
}
