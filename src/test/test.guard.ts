import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";

@Injectable()
export class TestGuard implements CanActivate {
  constructor(private reflector: Reflector) {
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>("roles", context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.params;
    console.log("roles", roles);
    console.log("user", user);
    if (roles.includes(user.role)) {
      request.user = { role: user.role };
      return true;
    }
  }
}
