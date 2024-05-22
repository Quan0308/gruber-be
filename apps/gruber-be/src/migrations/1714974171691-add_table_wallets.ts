import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddTableCreditWalletsInfo1714974171691 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "wallets",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
          {
            name: "amount",
            type: "decimal",
            isNullable: false,
            default: 0,
          },
          {
            name: "type",
            type: "enum",
            enum: ["credit", "cash"],
            isNullable: false,
            default: "'cash'",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
