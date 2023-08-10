import { Body, Controller, Delete, Get, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { WordsService } from "./words.service";
import { TStatusRes } from "../../utils/status";
import { TAccountWord } from "../../schemas/auth/types";
import { TWordsRes } from "./types";
import { JwtAuthGuard } from "../auth/guards/auth.guard";
import { AddWordDTO, ChangeWordDTO, DeleteWordDTO, SortWordsDTO } from "./words.dto";
import { Token } from "../../decorators/token.decorator";

@UseGuards(JwtAuthGuard)
@Controller("words")
export class WordsController {

  constructor(private readonly wordsService: WordsService) {
  }

  @Get()
  words(@Query("count") count: string, @Token("id") token: string): Promise<TStatusRes<TWordsRes>> {
    return this.wordsService.words(count, token);
  }

  @Post("add-word")
  addWord(@Body() word: AddWordDTO,@Token("id") token: string): Promise<TStatusRes<TAccountWord>> {
    return this.wordsService.addWord(word, token);
  }

  @Delete("delete-word")
  deleteWord(@Query() query: DeleteWordDTO, @Token("id") token: string): Promise<TStatusRes<string>> {
    return this.wordsService.deleteWord(query, token);
  }

  @Put("change-word")
  changeWord(@Body() data: ChangeWordDTO, @Token("id") token: string): Promise<TStatusRes<string>> {
    return this.wordsService.changeWord(data, token);
  }

  @Get("find-words")
  findWord(@Query("word") word: string, @Token("id") token: string): Promise<TStatusRes<Array<TAccountWord>>> {
    return this.wordsService.findWord(word, token);
  }

  @Post("sort-words")
  sortWords(@Body() data: SortWordsDTO, @Token("id") token: string): Promise<TStatusRes<Array<TAccountWord>>> {
    return this.wordsService.sortWords(data, token);
  }

  @Get("download-words")
  downloadWords(@Token("id") token: string):Promise<TStatusRes<string>> {
    return this.wordsService.downloadWords(token);
  }
}
