import { forwardRef, Module, NestModule, MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PinModule } from "../pin/pin.module";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { AuthMiddleware } from "./auth.middleware";
import { TwilioService } from "../twilio/twilio.service";
import { LoggerModule } from "../logger/logger.module";
import { MessageModule } from "../message/message.module";
import { CryptoService } from "../crypto/crypto.service";

@Module({
  imports: [
    LoggerModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => PinModule),
    forwardRef(() => MessageModule),
  ],
  providers: [UserService, TwilioService, CryptoService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: "user/all",
      method: RequestMethod.GET,
    });
  }
}
