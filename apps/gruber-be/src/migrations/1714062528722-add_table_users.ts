import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddTableUsers1714062528722 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
          {
            name: "full_name",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "phone",
            type: "varchar",
            length: "10",
            isUnique: true,
            isNullable: true,
          },
          {
            name: "avatar",
            type: "varchar",
            length: "512",
            isNullable: true,
          },
          {
            name: "role",
            type: "enum",
            enum: ["admin", "staff", "passenger", "driver"],
            default: "'passenger'",
          },
          {
            name: "firebase_uid",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "created_on",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_on",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
          {
            name: "current_location",
            type: "geometry",
            isNullable: true,
            default: null,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
