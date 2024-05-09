import { IsDateString, IsNotEmpty, IsPhoneNumber, IsString, Length } from "class-validator";

export class CreateCardInfoDto {
  @IsNotEmpty()
  @IsString()
  ownerId: string;

  @IsNotEmpty()
  @IsString()
  bankName: string;

  @IsNotEmpty()
  @IsString()
  cardAccountNumber: string;

  @IsNotEmpty()
  @IsString()
  cardAccountName: string;

  @IsNotEmpty()
  @IsDateString()
  cardExpiredDate: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 3)
  cardCvv: string;

  @IsNotEmpty()
  @IsPhoneNumber("VN")
  phone: string;
}
