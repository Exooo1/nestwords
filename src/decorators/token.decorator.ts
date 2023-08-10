import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if ("id" in request?.user) return request.user.id;
    return request.user;
  }
);
