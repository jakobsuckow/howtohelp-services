import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class PinGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    const auth = req.headers.authorization.split(" ");

    if (!auth) {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }
    const token = auth[1];

    if (token === "test") {
      return true;
    }
    throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
  }
}
