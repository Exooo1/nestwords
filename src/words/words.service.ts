import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { resStatus, TStatusRes } from "../utils/status";
import { IWordsService, TChangeWord, TDeleteWord, TSortWords, TWordsRes } from "./types";
import { IAccount, TAccountWord } from "../schemas/auth/types";
import { InjectModel } from "@nestjs/mongoose";
import { Account, TAccountDocument } from "../schemas/auth/account.schema";
import { Model } from "mongoose";
import * as fs from "fs";


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

  async changeWord(data: TChangeWord, user: string): Promise<TStatusRes<string>> {
    try {
      const { word, translate, description, id } = data;
      let person = (await this.authModel.findOne({ _id: user })) as IAccount;
      if (!person) throw new HttpException("Not Found user!", HttpStatus.NOT_FOUND);
      const result = person.profile.words[word[0].toLowerCase()].findIndex((item) => item._id == id);
      if (result === -1) throw new HttpException("You can't change a word that you don't have in the dictionary", HttpStatus.NOT_FOUND);
      person.profile.words[word[0].toLowerCase()][result].word = word;
      person.profile.words[word[0].toLowerCase()][result].translate = translate;
      person.profile.words[word[0].toLowerCase()][result].description = description;
      await person.save();
      return resStatus<string>(`You changed word @${word}`, 1, "", ``);
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

  async findWord(word: string, user: string): Promise<TStatusRes<Array<TAccountWord>>> {
    try {
      const profile = (await this.authModel.findOne({ _id: user })) as IAccount;
      if (!profile) throw new HttpException("Not Found words!", HttpStatus.NOT_FOUND);
      const filterWords = profile.profile.words[word[0].toLowerCase()].filter((item) =>
        item.word.includes(word[0].toUpperCase() + word.slice(1))
      );
      return resStatus<Array<TAccountWord>>(filterWords, 1);
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

  async sortWords(data: TSortWords, user: string): Promise<TStatusRes<Array<TAccountWord>>> {
    try {
      const profile = (await this.authModel.findOne({ _id: user })) as IAccount;
      if (!profile) throw new HttpException("Not Found!", HttpStatus.NOT_FOUND);
      const array: Array<TAccountWord> = [];
      const values = Object.values(profile.profile.words) as Array<Array<TAccountWord>>;
      for (let i = 0; i < values.length; i++) {
        if (values[i].length > 0) {
          array.push(...values[i]);
        }
      }
      let sort;
      switch (data.sortType) {
        case "ADDED":
          sort = data.isSort
            ? array.sort((a, b) => new Date(a.added).valueOf() - new Date(b.added).valueOf())
            : array.sort((a, b) => new Date(b.added).valueOf() - new Date(a.added).valueOf());
          break;
        case "DESCRIPTION":
          sort = array.filter((item) => item.description.length >= 1);
          break;
      }
      return resStatus<Array<TAccountWord>>(sort, 1);
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

  async downloadWords(user: string): Promise<TStatusRes<string>> {
    try {
      const profile = (await this.authModel.findOne({ _id: user })) as IAccount;
      if (!profile) throw new HttpException("Not Found User", HttpStatus.NOT_FOUND);
      const array: Array<TAccountWord> = [];
      const values = Object.values(profile.profile.words) as Array<Array<TAccountWord>>;
      for (let i = 0; i < values.length; i++) {
        if (values[i].length > 0) {
          array.push(...values[i]);
        }
      }
      const result = array
        .map((item, index) => {
          return `${index + 1}. ${item.word} - ${item.translate}\n`;
        })
        .join("");
      fs.unlink("src/words.txt", (err) => console.log(err));
      fs.appendFileSync("src/words.txt", result);
      if (result.length >= 1) return resStatus<string>(result, 1);
      else resStatus<null>(null, 0, "", "We didn't find the words!");
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