import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { IRepeat } from "./types";
import { InjectModel } from "@nestjs/mongoose";
import { Account, TAccountDocument } from "../../schemas/auth/account.schema";
import { Model } from "mongoose";
import { IAccount, TAccountWord } from "../../schemas/auth/types";
import { resStatus, TStatusRes } from "../../utils/status";

@Injectable()
export class RepeatService implements IRepeat {
  constructor(
    @InjectModel(Account.name)
    private readonly authModel: Model<TAccountDocument>
  ) {
  }

  async getRepeatWords(token: string): Promise<TStatusRes<Array<TAccountWord>>> {
    try {
      const profile = (await this.authModel.findOne({ _id: token }).select("profile.words")) as IAccount;
      if (!profile) throw new HttpException("NotFound!", HttpStatus.NOT_FOUND);
      const array: Array<TAccountWord> = [];
      const values = Object.values(profile.profile.words) as Array<Array<TAccountWord>>;
      for (let i = 0; i < values.length; i++) {
        if (values[i].length > 0) {
          array.push(...values[i]);
        }
      }
      return resStatus<Array<TAccountWord>>(array, 1);
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
;
