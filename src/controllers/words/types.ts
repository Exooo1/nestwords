import { TAccountWord } from "../../schemas/auth/types";
import { TStatusRes } from "../../utils/status";

export interface IWordsService {
  words(words: string, user: string): Promise<TStatusRes<TWordsRes>>;

  addWord(word: TAccountWord, token: string): Promise<TStatusRes<TAccountWord>>;

  deleteWord(word: TDeleteWord, token: string): Promise<TStatusRes<string>>;

  changeWord(data: TChangeWord, token: string): Promise<TStatusRes<string>>;

  findWord(data: string, token: string): Promise<TStatusRes<Array<TAccountWord>>>;

  sortWords(data:TSortWords,token:string): Promise<TStatusRes<Array<TAccountWord>>>

  downloadWords(token:string):Promise<TStatusRes<string>>
}

export type TWordsRes = {
  words: Array<TAccountWord>
  totalWords: number
}

export type TDeleteWord = {
  letter: string
  id: string
}

export type TChangeWord = {
  word: string
  description: string
  translate: string
  id: string
}

export type TSortWords = {
  isSort:boolean
  sortType:'ADDED' | 'DESCRIPTION'
}
