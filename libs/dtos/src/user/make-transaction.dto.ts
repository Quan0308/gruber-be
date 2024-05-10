import { TransactionType, WalletType } from "@types";
import { IsEnum, IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class MakeTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive({ message: "Amount must be positive" })
  amount: number;

  @IsNotEmpty()
  @IsEnum(WalletType)
  wallet: WalletType;

  @IsNotEmpty()
  @IsEnum(TransactionType)
  transaction_type: TransactionType;
}
