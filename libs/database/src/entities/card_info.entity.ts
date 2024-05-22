import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({ name: "cards_info" })
export class CardInfo extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "owner_id", type: "uuid", nullable: false })
  ownerId: string;

  @Column({ name: "bank_name", type: "varchar", length: 255, nullable: false })
  bankName: string;

  @Column({ name: "card_account_number", type: "varchar", length: 20, nullable: false })
  cardAccountNumber: string;

  @Column({ name: "card_account_name", type: "varchar", length: 255, nullable: false })
  cardAccountName: string;

  @Column({ name: "card_expired_date", type: "date", nullable: false })
  cardExpiredDate: Date;

  @Column({ name: "card_cvv", type: "varchar", length: 3, nullable: false })
  cardCvv: string;

  @Column({ name: "phone", type: "varchar", length: 10, nullable: false })
  phone: string;

  @OneToOne(() => User)
  @JoinColumn({ name: "owner_id", referencedColumnName: "id" })
  readonly owner: User;
}
