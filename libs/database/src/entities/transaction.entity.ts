import { TransactionStatus } from "@types";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "transactions" })
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "owner_id", type: "uuid", nullable: false })
  ownerId: string;

  @Column({ name: "amount", type: "decimal", nullable: false, default: 0 })
  amount: number;

  @CreateDateColumn({
    name: "transaction_date",
    type: "timestamp",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
  })
  transactionDate: Date;

  @Column({ name: "status", type: "enum", length: 10, nullable: false, default: "pending" })
  status: TransactionStatus;

  @Column({ name: "description", type: "varchar", length: 255, nullable: true, default: null })
  description: string;

  @Column({ name: "sender_name", type: "varchar", length: 255, nullable: true, default: null })
  senderName: string;

  @Column({ name: "receiver_name", type: "varchar", length: 255, nullable: true, default: null })
  receiverName: string;
}
