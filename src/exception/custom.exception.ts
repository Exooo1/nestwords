import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger
} from "@nestjs/common";
import { Request, Response } from "express";
import { resStatus } from "../utils/status";

type TResponse = {
  statusCode: number;
  message: string[];
  error: string;
};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger();

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const responseError = exception.getResponse() as TResponse;

    const loggerStatus = `method: ${request.method} - message: ${Array.isArray(responseError.message)?
      responseError.message.join(", "):responseError} - path: ${
      request.path
    } - time: ${new Date().toLocaleString()}`

    if (Array.isArray(responseError.message)) {
      response
        .status(responseError.statusCode)
        .json(resStatus(null, 0, responseError.message.join(", ")));
      this.logger.error(loggerStatus);
    } else {
      this.logger.error(loggerStatus);
      response.status(status).json({
        item: null,
        resultCode: 0,
        error: responseError,
        timestamp: new Date().toISOString()
      });
    }
  }
}
