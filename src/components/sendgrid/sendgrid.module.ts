import { Module } from "@nestjs/common";
import { LoggerModule } from "../logger/logger.module";
import { SendgridService } from "./sendgrid.service";

@Module({
  imports: [LoggerModule.forRoot()],
  providers: [SendgridService],
})
export class SendgridModule {}
