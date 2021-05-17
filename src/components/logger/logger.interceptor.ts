import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common"
import { Observable } from "rxjs"
import { tap } from "rxjs/operators"
import { LoggerService } from "./logger.service"

const logger = new LoggerService()
logger.setContext("LoggerInterceptor")

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>()
    logger.log(`${request.url}`)
    const now = Date.now()
    return next.handle().pipe(
      tap(() => {
        logger.log(`${request.url} - ${Date.now() - now}ms`)
      })
    )
  }
}
