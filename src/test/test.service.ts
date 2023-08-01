import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Account, TAccountDocument } from "../schemas/auth/account.schema";
import { Model } from "mongoose";


@Injectable()
export class TestService  {

  constructor(@InjectModel(Account.name) private readonly authModel: Model<TAccountDocument>) {
  }


  getCheck(){
    return "this is check!"
  }
}