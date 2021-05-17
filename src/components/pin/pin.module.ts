import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LocationService } from "../location/location.service";
import { LoggerModule } from "../logger/logger.module";
import { SegmentService } from "../segment/segment.service";
import { SendgridService } from "../sendgrid/sendgrid.service";
import { TwilioService } from "../twilio/twilio.service";
import { AuthMiddleware } from "../user/auth.middleware";

import { UserEntity } from "../user/user.entity";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";
import { PinController } from "./pin.controller";
import { PinEntity } from "./pin.entity";
import { PinService } from "./pin.service";

@Module({
  imports: [
    LoggerModule.forRoot(),
    TypeOrmModule.forFeature([PinEntity, UserEntity]),
    forwardRef(() => UserModule),
  ],
  controllers: [PinController],
  providers: [
    PinService,
    SegmentService,
    LocationService,
    UserService,
    TwilioService,
    SendgridService,
  ],
  exports: [PinService],
})
export class PinModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: "pin/approve/:id", method: RequestMethod.PUT },
        { path: "pin/deny/:id", method: RequestMethod.PUT },
        { path: "pin/list", method: RequestMethod.GET }
      );
  }
}
