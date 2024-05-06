import { TransactionStatus } from "@types";
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

  @Column({
    name: "status",
    type: "enum",
    enum: TransactionStatus,
    nullable: false,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column({ name: "description", type: "varchar", length: 255, nullable: true, default: null })
  description: string;

  @Column({ name: "sender_name", type: "varchar", length: 255, nullable: true, default: null })
  senderName: string;

  @Column({ name: "receiver_name", type: "varchar", length: 255, nullable: true, default: null })
  receiverName: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.transaction)
  wallet: Wallet;
}
