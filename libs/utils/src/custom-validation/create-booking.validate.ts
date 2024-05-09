import { PipeTransform, BadRequestException, Injectable } from "@nestjs/common";
import { CreateBookingByPassengerDto, CreateBookingByStaffDto } from "@dtos";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

@Injectable()
export class CreateBookingValidationPipe implements PipeTransform {
  async transform(value: CreateBookingByPassengerDto | CreateBookingByStaffDto) {
    let errorsBookingByPassenger,
      errorsBookingByStaff = [];
    errorsBookingByPassenger = await validate(plainToClass(CreateBookingByPassengerDto, value));
    errorsBookingByStaff = await validate(plainToClass(CreateBookingByStaffDto, value));
    if (errorsBookingByPassenger.length > 0 && errorsBookingByStaff.length > 0) {
      const combinedErrors = errorsBookingByPassenger.concat(errorsBookingByStaff);
      const errorMessages = combinedErrors.map((error) => Object.values(error.constraints).join(", ")).join("; ");
      throw new BadRequestException(errorMessages);
    }

    return value;
  }
}
