import { contextsForLoggers } from "./logger.decorator"
import { LoggerService } from "./logger.service"
import { Provider } from "@nestjs/common"

function loggerFactory(logger: LoggerService, context: string) {
  if (context) logger.setContext(context)
  return logger
}

function createLoggerProvider(context: string): Provider<LoggerService> {
  return {
    provide: `LoggerService${context}`,
    useFactory: (logger) => loggerFactory(logger, context),
    inject: [LoggerService],
  }
}

export function createLoggerProviders(): Array<Provider<LoggerService>> {
  return contextsForLoggers.map((context) => createLoggerProvider(context))
}
