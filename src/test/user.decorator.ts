import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    console.log(data, "data");
    const request = ctx.switchToHttp().getRequest();
    if (data in request.user) return request.user[data];
    return request.user;
  }
);
