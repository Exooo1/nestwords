import { ConsoleLogger } from '@nestjs/common';

export class CustomLogger extends ConsoleLogger {
  log(message: string, stack?: string, context?: string) {
    super.log(message, stack, context);
  }
  error(message: string, stack?: string, context?: string) {
    super.error(message, stack, context);
  }
}