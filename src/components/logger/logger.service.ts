import { Injectable, Scope } from "@nestjs/common"
import { Logger as Log } from "winston"
import * as winston from "winston"

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
  private logger: Log
  private context = "Default"

  constructor() {
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.json(),
      defaultMeta: { service: "howtohelp" },
      transports: [
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" }),
        new winston.transports.Console({
          level: "debug",
          silent: process.env.NODE_ENV === "test",
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(
              (info): string =>
                `${info.timestamp} ${info.level} - ${this.context} - ${info.message}`
            )
          ),
        }),
      ],
    })
  }

  setContext(context: string): void {
    this.context = context
  }

  log(message: string): void {
    this.logger.info(message, { context: this.context })
  }

  error(message: string, trace: string): void {
    this.logger.error(message, { context: this.context })
    if (trace) this.logger.error(trace)
  }

  warn(message: string): void {
    this.logger.warn(message, { context: this.context })
  }

  debug(message: string): void {
    this.logger.debug(message, { context: this.context })
  }

  verbose(message: string): void {
    this.logger.verbose(message, { context: this.context })
  }
}
