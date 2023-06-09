import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { resStatus, TStatusRes } from "../utils/status";
import { IWordsService, TChangeWord, TDeleteWord, TWordsRes } from "./types";
import { IAccount, TAccountWord } from "../schemas/auth/types";
import { InjectModel } from "@nestjs/mongoose";
import { Account, TAccountDocument } from "../schemas/auth/account.schema";
import { Model } from "mongoose";


@Injectable()
export class WordsService implements IWordsService {

  constructor(
    @InjectModel(Account.name)
    private readonly authModel: Model<TAccountDocument>
  ) {
  }

  async words(count: string, user: string): Promise<TStatusRes<TWordsRes>> {
    try {
      const profile = (await this.authModel.findOne({ _id: user }, "profile.words profile.totalWords")) as IAccount;
      if (!profile) throw new HttpException("NotFound", HttpStatus.NOT_FOUND);
      const array: Array<TAccountWord> = [];
      const values = Object.values(profile.profile.words) as Array<Array<TAccountWord>>;
      for (let i = 0; i < values.length; i++) {
        if (values[i].length > 0) {
          array.push(...values[i]);
        }
      }
      const resultWords = [];
      for (let i = (+count - 1) * 15; i < +count * 15; i++) {
        if (array[i]) resultWords.push(array[i]);
        else break;
      }
      return resStatus<TWordsRes>({ words: resultWords, totalWords: profile.profile.totalWords }, 1);
    } catch (err) {
      const error = err as HttpException;
      let status: number;
      if (typeof error.getStatus === "function") status = error.getStatus();
      if (status) throw new HttpException(error.message, status);
      else
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }

  async addWord(word: TAccountWord, user: string): Promise<TStatusRes<TAccountWord>> {
    try {
      const words = (await this.authModel.findOne({ _id: user })) as IAccount;
      const repeat = words.profile.words[word.word[0].toLowerCase()].filter((item) => item.word === word.word);
      if (repeat.length) throw new HttpException("The word is already in the dictionary.", HttpStatus.CONFLICT);
      words.profile.words[word.word[0].toLowerCase()].unshift({
        ...word
      });
      words.profile.totalWords += 1;
      await words.save();
      return resStatus<TAccountWord>(word, 1, "", `You added word @${word.word} ${new Date().toTimeString().split(" ")[0]}`);
    } catch (err) {
      const error = err as HttpException;
      let status: number;
      if (typeof error.getStatus === "function") status = error.getStatus();
      if (status) throw new HttpException(error.message, status);
      else
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }

  async deleteWord(data: TDeleteWord, user: string): Promise<TStatusRes<string>> {
    try {
      const { letter, id } = data;
      const account = await this.authModel.findOne({ _id: user }) as IAccount;
      if (!account) throw new HttpException("The user was not found", HttpStatus.NOT_FOUND);
      account.profile.words[letter].pull({ _id: id });
      account.profile.totalWords -= 1;
      await account.save();
      return resStatus<string>("You removed word", 1, "Removed");
    } catch (err) {
      const error = err as HttpException;
      let status: number;
      if (typeof error.getStatus === "function") status = error.getStatus();
      if (status) throw new HttpException(error.message, status);
      else
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }

  async changeWord(data:TChangeWord,user:string):Promise<TStatusRes<string>>{
    try {
      const {word, translate, description, id} = data
      let person = (await this.authModel.findOne({_id:  user})) as IAccount
      if(!person) throw new HttpException('Not Found user!', HttpStatus.NOT_FOUND)
      const result = person.profile.words[word[0].toLowerCase()].findIndex((item) => item._id == id)
      if(result === -1) throw new HttpException('You can\'t change a word that you don\'t have in the dictionary',HttpStatus.NOT_FOUND)
      person.profile.words[word[0].toLowerCase()][result].word = word
      person.profile.words[word[0].toLowerCase()][result].translate = translate
      person.profile.words[word[0].toLowerCase()][result].description = description
      await person.save()
      return resStatus<string>(`You changed word @${word}`, 1, '', ``)
    } catch (err) {
      const error = err as HttpException;
      let status: number;
      if (typeof error.getStatus === "function") status = error.getStatus();
      if (status) throw new HttpException(error.message, status);
      else
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }

}