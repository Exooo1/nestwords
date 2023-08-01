import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { map, Observable } from "rxjs";
import { tap } from 'rxjs/operators';

@Injectable()
export class TestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    console.log(`Request to ${request.url} with method ${request.method}`);

    return next.handle().pipe(
      map((data) => {
        return {
          name:'test',
          surname:'Testing!'
        }
      })
    );
  }
}