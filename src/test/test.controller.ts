import { Controller, Get, UseGuards, UseInterceptors } from "@nestjs/common";
import { TestService } from "./test.service";
import { TestGuard } from "./test.guard";
import { Roles } from "../profile/roles.decorator";
import { TestInterceptor } from "../profile/test.interceptor";

@UseInterceptors(TestInterceptor)
@Controller("test")
export class TestController {
  constructor(private readonly testService: TestService) {
  }


  @UseGuards(TestGuard)
  @Get("/check/:role")
  @Roles('admin','simple-user','picker','cashier')
  getTest() {
    return this.testService.getCheck();
  }
}