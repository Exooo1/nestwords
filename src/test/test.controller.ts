import { Controller, Get, Req, UseGuards, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { TestService } from "./test.service";
import { TestGuard } from "./test.guard";
import { Auth, Roles } from "./roles.decorator";
import { TestInterceptor } from "./test.interceptor";
import { User } from "./user.decorator";
import { Token } from "../decorators/token.decorator";
import { TestDto } from "./test.dto";

// @UseInterceptors(TestInterceptor)
@Controller("test")
export class TestController {
  constructor(private readonly testService: TestService) {
  }


  // @Auth('admin')
  // @Get("check/:role")
  // getTest(@User('role') token:any,@Req() req) {
  //   console.log(token,'here!')
  //   return this.testService.getCheck();
  // }

  @Auth('admin','simple-user','picker','cashier')
  @UseGuards(TestGuard)
  @Roles('admin','simple-user','picker','cashier')
  @Get("check/:role")
  getTest(@User('role') token:any,@Req() req) {
    console.log(token,'here!')
    return this.testService.getCheck();
  }

//будет ошибка, в токен нету name + должо быть больше 5 символов!
  @Get('decor')
  getDecor(@Token(new ValidationPipe({ validateCustomDecorators: true })) token:TestDto){
    console.log(token)
    return 'it works'
  }
}
