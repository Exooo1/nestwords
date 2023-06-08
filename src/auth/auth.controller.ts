import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailDTO, SignUpDTO } from './auth.dto';
import { TStatusRes } from '../utils/status';
import { IAuthController } from './types';

@Controller('auth')
export class AuthController implements IAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() data: SignUpDTO): Promise<TStatusRes<string>> {
    return this.authService.signUp(data);
  }

  @Post('email')
  sendEmail(@Body() data: EmailDTO): Promise<TStatusRes<null>> {
    return this.authService.sendEmail(data);
  }

  @Post('login')
  login(){
    return this.authService.login()
  }
}
