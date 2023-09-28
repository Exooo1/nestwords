import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDTO, NewPasswordDTO, SignUpDTO } from "./auth.dto";
import { JwtAuthGuard } from "./guards/auth.guard";
import { IAuthController, TLoginRes } from "./types";
import { TStatusRes } from "../../utils/status";
import { Token } from "../../decorators/token.decorator";

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
  me(@Token("id") token: string):Promise<TStatusRes<number>>  {
    return this.authService.me(token);
  }

  @UseGuards(JwtAuthGuard)
  @Put("logout")
  logOut(@Token("id") token: string): Promise<TStatusRes<number>> {
    return this.authService.logOut(token);
  }

  @Get("change-password")
  changePassword(@Query("email") email: string): Promise<TStatusRes<null>> {
    return this.authService.changePassword(email);
  }

  @Post("new-password")
  newPassword(@Body() data:NewPasswordDTO): Promise<TStatusRes<null>> {
    return this.authService.newPassword(data);
  }
}
