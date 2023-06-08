import { ConsoleLogger } from '@nestjs/common';

export class CustomLogger extends ConsoleLogger {
  log(message: string, stack?: string, context?: string) {
    super.log(
      `${stack} message:${message} time:${new Date().toLocaleString()}`,
    );
  }

  error(message: any, stack?: string, context?: string) {
    super.error(message);
  }

  warn(message: string, stack?: string, context?: string) {
    super.warn(message);
  }

  debug(message: string,stack?: string, context?: string) {
    super.debug(message)
  }
}
