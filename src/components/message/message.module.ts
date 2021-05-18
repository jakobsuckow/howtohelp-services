import { forwardRef, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MessageService } from "./message.service";
import { MessageController } from "./message.controller";
import { LoggerModule } from "../logger/logger.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessageEntity } from "./message.entity";
import { UserEntity } from "../user/user.entity";
import { AuthMiddleware } from "../user/auth.middleware";
import { UserModule } from "../user/user.module";


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
