import { TAccountWord } from "../schemas/auth/types";
import { TStatusRes } from "../utils/status";

export interface IWordsService {
  words(words: string, user: string): Promise<TStatusRes<TWordsRes>>;
  addWord(word: TAccountWord, user: string): Promise<TStatusRes<TAccountWord>>;
}

export type TWordsRes = {
  words: Array<TAccountWord>
  totalWords: number
}