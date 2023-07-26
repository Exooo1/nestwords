import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Account, TAccountDocument } from "../schemas/auth/account.schema";
import { Model } from "mongoose";
import { IProfile, TProfileInfo } from "./types";
import { resStatus, TStatusRes } from "../utils/status";
import { IAccount } from "../schemas/auth/types";
import * as fs from "fs-extra";
import * as path from "path";


@Injectable()
export class ProfileService implements IProfile {
  private logger = new Logger(ProfileService.name);

  constructor(@InjectModel(Account.name) private readonly authModel: Model<TAccountDocument>) {
  }

  async getProfile(user: string): Promise<TStatusRes<TProfileInfo>> {
    try {
      const account = await this.authModel.findOne({ _id: user }, { "profile.words": 0 }) as IAccount;
      if (!account) throw new HttpException("Not Found(User)", HttpStatus.NOT_FOUND);
      return resStatus<TProfileInfo>(account.profile, 1);
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

  async setAvatar(user: string, avatar: string): Promise<TStatusRes<string>> {
    try {
      const account = await this.authModel.findOne({ _id: user }) as IAccount;
      if (!account) throw new HttpException("Not Found(User)", HttpStatus.NOT_FOUND);
      if (account.profile.avatar) {
        const avatarPath = path.resolve(__dirname, "../../", `src/uploads/${account.profile.avatar}`);
        await fs.unlink(avatarPath, (err) => this.logger.error(err));
      }
      account.profile.avatar = avatar;
      await account.save();
      return resStatus<string>(account.profile.avatar, 1);
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