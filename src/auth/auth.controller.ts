import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { EmailDTO, LoginDTO, SignUpDTO } from "./auth.dto";
import { TStatusRes } from "../utils/status";
import { IAuthController } from "./types";
import { JwtAuthGuard } from "./guards/auth.guard";

@Controller("auth")
export class AuthController implements IAuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post("signup")
  signUp(@Body() data: SignUpDTO): Promise<TStatusRes<string>> {
    return this.authService.signUp(data);
  }

  @Post("email")
  sendEmail(@Body() data: EmailDTO): Promise<TStatusRes<null>> {
    return this.authService.sendEmail(data);
  }

  @Post("login")
  login(@Body() data: LoginDTO): Promise<TStatusRes<string>> {
    return this.authService.login(data);
  }

  @Post("confirm")
  confirm(@Body("id") id): Promise<TStatusRes<string>> {
    return this.authService.confirm(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("cats")
  cats(@Req() req) {
    console.log(req.user);
    return "Cats!";
  }
}
