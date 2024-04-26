import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { isNil } from "lodash";

interface SuccessResponse<T> {
  statusCode: number;
  message: string;
  data?: T | object | object[] | null;
}

const transform = <T>(raw?: T): SuccessResponse<T> => {
  const response: SuccessResponse<T> = {
      statusCode: HttpStatus.OK,
      message: HttpStatus[HttpStatus.OK],
      data: null,
  };

  response.data = raw && isNil((raw as any)["data"]) ? raw : (raw as any)?.data ?? null;

  return response;
}

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<T, SuccessResponse<T>> {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(transform));
  }
}
