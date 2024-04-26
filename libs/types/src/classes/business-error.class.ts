import { HttpException, HttpStatus } from "@nestjs/common";
import { IBusinessError } from "../interfaces/business-error.interface";
import { BusinessErrorCodeEnum } from "../enums/business-error-code.enum";

export class BusinessException extends HttpException {
  public errors: IBusinessError[];

  constructor(error: IBusinessError);
  constructor(error: IBusinessError, status: HttpStatus);
  constructor(error: IBusinessError[]);
  constructor(error: IBusinessError[], status: HttpStatus);

  constructor(error: IBusinessError | IBusinessError[], status: HttpStatus = HttpStatus.BAD_REQUEST) {
    const errors = Array.isArray(error) ? error : [error];

    super({ errors }, status);
    const defaultMessage = "We have encountered an error. Please try again later.";
    this.message = !Array.isArray(error) ? error.message : defaultMessage;
    this.errors = errors;
  }
}

export const BussinessError = (
  code: BusinessErrorCodeEnum,
  message: string,
  status: HttpStatus = HttpStatus.BAD_REQUEST
) => new BusinessException({ code, message }, status);
