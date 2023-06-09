import { Body, Controller, Get, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDTO, SignUpDTO } from "./auth.dto";
import { JwtAuthGuard } from "./guards/auth.guard";
import { IAuthController, TLoginRes } from "./types";
import { TStatusRes } from "../utils/status";

@Controller("auth")
export class AuthController implements IAuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post("signup")
  signUp(@Body() data: SignUpDTO): Promise<TStatusRes<string>> {
    return this.authService.signUp(data);
  }

  @Post("login")
  login(@Body() data: LoginDTO): Promise<TStatusRes<TLoginRes>> {
    return this.authService.login(data);
  }

  @Post("confirm")
  confirm(@Body("id") id: string): Promise<TStatusRes<string>> {
    return this.authService.confirm(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@Req() req) {
    return this.authService.me(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put("logout")
  logOut(@Req() req) {
    return this.authService.logOut(req.user.id);
  }
}
