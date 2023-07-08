import { Body, Controller, Delete, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { WordsService } from "./words.service";
import { TStatusRes } from "../utils/status";
import { TAccountWord } from "../schemas/auth/types";
import { TWordsRes } from "./types";
import { JwtAuthGuard } from "../auth/guards/auth.guard";

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
  addWord(@Body() word: TAccountWord, @Req() req): Promise<TStatusRes<TAccountWord>> {
    return this.wordsService.addWord(word, req.user.id);
  }

  @Delete("delete-word")
  deleteWord(@Query() query, @Req() req): Promise<TStatusRes<string>> {
    query.user = req.user.id;
    return this.wordsService.deleteWord(query);
  }
}