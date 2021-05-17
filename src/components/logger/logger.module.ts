import { DynamicModule } from "@nestjs/common"
import { LoggerService } from "./logger.service"
import { createLoggerProviders } from "./logger.provider"

export class LoggerModule {
  static forRoot(): DynamicModule {
    const loggerProviders = createLoggerProviders()
    return {
      module: LoggerModule,
      providers: [LoggerService, ...loggerProviders],
      exports: [LoggerService, ...loggerProviders],
    }
  }
}
