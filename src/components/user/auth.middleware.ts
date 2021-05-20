import { HttpException, Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NextFunction, Request } from "express";
import * as jwt from "jsonwebtoken";
import { Logger } from "../logger/logger.decorator";
import { LoggerService } from "../logger/logger.service";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  secret = null;
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    @Logger("JWT")
    private readonly loggerService: LoggerService
  ) {
    this.secret = this.configService.get("JWT_ACCESS_SECRET");
  }
  async use(req: Request, _res: Response, next: NextFunction) {
    const authHeaders = req.headers.authorization;
    if (
      authHeaders &&
      (authHeaders as string).split(" ")[0] === "Bearer" &&
      (authHeaders as string).split(" ")[1]
    ) {
      const token = (authHeaders as string).split(" ")[1];

      if (!token) {
        throw new HttpException("Token missing", 403);
      }
      let decoded = null;
      try {
        decoded = jwt.verify(token, this.configService.get("JWT_SECRET"));
        const user = await this.userService.findOne(decoded.id);
        req["user"] = user;
        next();
      } catch (error) {
        throw error;
      }
    } else {
      throw new HttpException("Protected", 403);
    }
  }
}
