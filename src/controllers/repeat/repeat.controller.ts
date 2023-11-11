import { Controller, Get, UseGuards } from "@nestjs/common";
import { RepeatService } from "./repeat.service";
import { Token } from "../../decorators/token.decorator";
import { JwtAuthGuard } from "../auth/guards/auth.guard";

@UseGuards(JwtAuthGuard)
@Controller("repeat")
export class RepeatController {
  constructor(private readonly repeatService: RepeatService) {
  }

  @Get('get-words')
  getRepeatWords(@Token("id") id: string) {
     return this.repeatService.getRepeatWords(id)
  }
}
