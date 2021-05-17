import { Module } from "@nestjs/common";
import { LoggerModule } from "../logger/logger.module";
import { SegmentService } from "../segment/segment.service";

@Module({
  imports: [LoggerModule.forRoot()],
  providers: [SegmentService],
  exports: [SegmentService],
})
export class SegmentModule {}
