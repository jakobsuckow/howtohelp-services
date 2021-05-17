import { Module } from "@nestjs/common";
import { LoggerModule } from "../logger/logger.module";
import { TwilioService } from "./twilio.service";


@Module({
  imports: [LoggerModule.forRoot()],
  providers: [TwilioService],
})
export class TwilioModule {}
