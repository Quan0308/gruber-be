import { BusinessErrorCodeEnum } from "../enums/business-error-code.enum";

export interface IBusinessError {
    code: BusinessErrorCodeEnum;
    message: string;
}
