import { Body, Controller, Delete, Get, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { WordsService } from "./words.service";
import { TStatusRes } from "../utils/status";
import { TAccountWord } from "../schemas/auth/types";
import { TWordsRes } from "./types";
import { JwtAuthGuard } from "../auth/guards/auth.guard";
import { AddWordDTO, ChangeWordDTO, DeleteWordDTO } from "./words.dto";

@UseGuards(JwtAuthGuard)
@Controller("words")
export class WordsController {

  constructor(private readonly wordsService: WordsService) {
  }

  @Get()
  words(@Query("count") count: string, @Req() req): Promise<TStatusRes<TWordsRes>> {
    return this.wordsService.words(count, req.user.id);
  }

  @Post("add-word")
  addWord(@Body() word: AddWordDTO, @Req() req): Promise<TStatusRes<TAccountWord>> {
    return this.wordsService.addWord(word, req.user.id);
  }

  @Delete("delete-word")
  deleteWord(@Query() query: DeleteWordDTO, @Req() req): Promise<TStatusRes<string>> {
    return this.wordsService.deleteWord(query, req.user.id);
  }

  @Put("change-word")
  changeWord(@Body() data: ChangeWordDTO, @Req() req) {
    return this.wordsService.changeWord(data, req.user.id);
  }
}