import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../controllers/auth/guards/auth.guard";
import { TestGuard } from "./test.guard";

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);


export function Auth(...roles: string[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(TestGuard),
  );
}
