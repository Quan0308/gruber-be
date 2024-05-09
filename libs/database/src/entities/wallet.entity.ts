import { WalletType } from "@types";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Transaction } from "./transaction.entity";

@Entity({ name: "wallets" })
export class Wallet extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "amount", type: "decimal", default: 0 })
  amount: number;

  @Column({ name: "type", type: "enum", enum: WalletType, nullable: false, default: WalletType.CASH })
  type: WalletType;
}
