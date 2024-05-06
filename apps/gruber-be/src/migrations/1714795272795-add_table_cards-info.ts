import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class AddTableCardsInfo1714795272795 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "cards_info",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "owner_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "bank_name",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "card_account_number",
            type: "varchar",
            length: "20",
            isNullable: false,
            isUnique: true,
          },
          {
            name: "card_account_name",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "card_expired_date",
            type: "date",
            isNullable: false,
          },
          {
            name: "card_cvv",
            type: "varchar",
            length: "3",
            isNullable: false,
            isUnique: true,
          },
          {
            name: "phone",
            type: "varchar",
            length: "10",
            isNullable: false,
          },
        ],
      })
    );
    const foreignKey = new TableForeignKey({
      columnNames: ["owner_id"],
      referencedColumnNames: ["id"],
      referencedTableName: "users",
    });
    await queryRunner.createForeignKey("cards_info", foreignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
