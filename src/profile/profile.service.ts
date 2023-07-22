import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Account, TAccountDocument } from "../schemas/auth/account.schema";
import { Model } from "mongoose";
import { IProfile, TProfileInfo } from "./types";
import { resStatus, TStatusRes } from "../utils/status";
import { IAccount } from "../schemas/auth/types";


@Injectable()
export class ProfileService implements IProfile {
  private logger = new Logger(ProfileService.name);

  constructor(@InjectModel(Account.name) private readonly authModel: Model<TAccountDocument>) {
  }

  async getProfile(user: string): Promise<TStatusRes<TProfileInfo>> {
    try {
      const account = await this.authModel.findOne({ _id: user }, { "profile.words": 0 }) as IAccount;
      if (!account) throw new HttpException("Not Found(User)", HttpStatus.NOT_FOUND);
      return resStatus<any>(account.profile, 1);
    } catch (err) {

    }
  }
}