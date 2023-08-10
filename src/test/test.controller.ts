import { Controller, Get, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { TestService } from "./test.service";
import { TestGuard } from "./test.guard";
import { Roles } from "./roles.decorator";
import { TestInterceptor } from "./test.interceptor";
import { User } from "./user.decorator";

@UseInterceptors(TestInterceptor)
@Controller("test")
export class TestController {
  constructor(private readonly testService: TestService) {
  }


  @UseGuards(TestGuard)
  @Get("/check/:role")
  @Roles('admin','simple-user','picker','cashier')
  getTest(@User('role') token:any,@Req() req) {
    console.log(token,'here!')
    return this.testService.getCheck();
  }
}
