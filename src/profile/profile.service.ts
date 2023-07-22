import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Account, TAccountDocument } from "../schemas/auth/account.schema";
import { Model } from "mongoose";


@Injectable()
export class ProfileService {
  private logger = new Logger(ProfileService.name);

  constructor(@InjectModel(Account.name) private readonly authModel: Model<TAccountDocument>) {
  }
}