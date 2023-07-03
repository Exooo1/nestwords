import { Module } from "@nestjs/common";
import { WordsController } from "./words.controller";
import { WordsService } from "./words.service";
import { AuthModule } from "../auth/auth.module";


@Module({
  imports: [AuthModule],
  controllers: [WordsController],
  providers: [WordsService]
})
export class WordsModule {
}
