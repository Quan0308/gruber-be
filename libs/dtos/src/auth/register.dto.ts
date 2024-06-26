import { RoleEnum } from "@types";
import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @IsString()
  @IsNotEmpty({ message: "Password is required" })
  password: string;

  @IsNotEmpty({ message: "Role is required" })
  @IsEnum(RoleEnum)
  role: RoleEnum;
}
