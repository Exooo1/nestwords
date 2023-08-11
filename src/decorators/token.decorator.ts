import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

export const Token = createParamDecorator<string>(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  }
);
