import { TransactionStatus, TransactionType } from "@types";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Wallet } from "./wallet.entity";

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

  @Column({ name: "sender", type: "varchar", length: "20", nullable: false })
  sender: string;

  @Column({ name: "receiver", type: "varchar", length: "20", nullable: false })
  receiver: string;
}
