import { IsString } from "class-validator";

export class UpdateUserGeneralInfoDto {
    @IsString()
    fullName: string;

    @IsString()
    phone: string;
}