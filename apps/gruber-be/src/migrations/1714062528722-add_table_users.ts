import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddTableUsers1714062528722 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "varchar",
            length: "36",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
          {
            name: "full_name",
            type: "nvarchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "phone",
            type: "varchar",
            length: "10",
            isNullable: false,
            isUnique: true,
            default: null,
          },
          {
            name: "avatar",
            type: "nvarchar",
            isNullable: true,
            default: null,
          },
          {
            name: "role",
            type: "enum",
            enum: ["ADMIN", "USER"],
            isNullable: false,
            default: "'USER'",
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
            isNullable: true,
          },
          {
            name: "updated_on",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: true,
          },
        ],
      })
    );
  }

  public async down(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
