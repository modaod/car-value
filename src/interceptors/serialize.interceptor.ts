import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

interface ClassContructor {
   new (...args: any[]): {};
}

export function Serialize(dto: ClassContructor) {
   return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
   constructor(private dto: any) {}

   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
         map(data => {
            const res = plainToInstance(this.dto, data, {
               excludeExtraneousValues: true,
            });
         return res;
         })
      );
   }
}