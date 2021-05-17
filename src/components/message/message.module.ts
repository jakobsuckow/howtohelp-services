import { forwardRef, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MessageService } from "./message.service";
import { MessageController } from "./message.controller";
import { LoggerModule } from "../logger/logger.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessageEntity } from "./message.entity";
import { UserEntity } from "../user/user.entity";
import { AuthMiddleware } from "../user/auth.middleware";
import { UserService } from "../user/user.service";
import { UserModule } from "../user/user.module";
import { TwilioModule } from "../twilio/twilio.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    LoggerModule.forRoot(),
    TypeOrmModule.forFeature([MessageEntity, UserEntity]),
    forwardRef(() => UserModule),
  ],
  providers: [MessageService],
  controllers: [MessageController],
})
export class MessageModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(MessageController);
  }
}
