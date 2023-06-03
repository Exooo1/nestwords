import { ConsoleLogger } from "@nestjs/common";

export class CustomLogger extends ConsoleLogger {

  log(message: string, stack?: string, context?: string) {
    super.log(message);
  }

  error(message: any, stack?: string, context?: string) {
    super.error(message);
  }

  warn(message: string, stack?: string, context?: string) {
    super.warn(message);
  }

}