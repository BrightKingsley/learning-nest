import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToInstance } from "class-transformer";

interface ClassConstructor {
  // To create a class type
  new (...args: any[]): {};
}

// This is a custom Interceptor
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // NOTE: Run Something before a request is handled by request handler
    return next.handle().pipe(
      map((data: any) => {
        // NOTE: Run something before the response is sent out
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
