import { Module } from "@nestjs/common";
import { LocationService } from "./location.service";
import { LocationController } from "./location.controller";
import { LoggerModule } from "../logger/logger.module";

@Module({
  imports: [LoggerModule.forRoot()],
  providers: [LocationService],
  controllers: [LocationController],
})
export class LocationModule {}
