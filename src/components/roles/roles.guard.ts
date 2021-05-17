import { CanActivate, ExecutionContext, HttpException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    console.log(`hi from decorator`);
    const roles = this.reflector.get<string[]>("roles", context.getHandler());

    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new HttpException("No user Found", 404);

    return user.roles.some((role: string) => roles.includes(role));
  }
}
