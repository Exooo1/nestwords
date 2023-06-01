import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { Request, Response } from "express";
import { resStatus } from "../utils/status";

type TResponse = {
  statusCode: number
  message: string[]
  error: string
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const responseError = exception.getResponse() as TResponse;


    if (responseError?.message.length) {
      response.status(responseError.statusCode).json(resStatus(null, 0, responseError.message.join(', ')));
    } else {
      response
        .status(status)
        .json({
          item: null,
          resultCode: 0,
          error: exception.getResponse(),
          timestamp: new Date().toISOString()
        });
    }
  }
}