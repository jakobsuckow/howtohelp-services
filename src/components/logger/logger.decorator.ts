import { Inject } from "@nestjs/common"

export const contextsForLoggers: string[] = new Array<string>()

// TODO:
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function Logger(context = "") {
  if (!contextsForLoggers.includes(context)) contextsForLoggers.push(context)
  return Inject(`LoggerService${context}`)
}
