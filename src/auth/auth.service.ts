import { Injectable } from "@nestjs/common";
import { Account, TAccountDocument } from "../schemas/auth/account.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { CAccountProfile, IAccount } from "../schemas/auth/types";
import { resStatus, TStatusRes } from "../utils/status";
import { EmailDTO, SignUpDTO } from "./auth.dto";
import { IAuthService } from "./types";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class AuthService implements IAuthService {
  readonly profile: CAccountProfile = {
    firstName: "",
    lastName: "",
    totalWords: 0,
    words: {
      a: [],
      b: [],
      c: [],
      d: [],
      e: [],
      f: [],
      g: [],
      h: [],
      i: [],
      j: [],
      k: [],
      l: [],
      m: [],
      n: [],
      o: [],
      p: [],
      q: [],
      r: [],
      s: [],
      t: [],
      u: [],
      v: [],
      w: [],
      x: [],
      y: [],
      z: []
    }
  };

  constructor(
    @InjectModel(Account.name) private readonly authModel: Model<TAccountDocument>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService
  ) {
  }

  async signUp(data: SignUpDTO): Promise<TStatusRes<string>> {
    try {
      const { email, password, firstName, lastName } = data;
      const account = await this.authModel.find({ email }).exec();
      if (account) return resStatus<null>(null, 0, "Email already exists", "You have account!");
      const hashedPassword = await bcrypt.hash(password, 11);
      const newAccount = await this.authModel.create({
        email, password: hashedPassword, profile: { ...this.profile, firstName, lastName },
        created: new Date().toLocaleString()
      }) as IAccount;
      return resStatus(this.jwtService.sign({ id: newAccount._id }), 1, "", "Account was created.");
    } catch (err) {
      const error = err as Error;
      return resStatus<null>(null, 0, error.message, "The server is unavailable");
    }
  }

  async login(): Promise<TStatusRes<string>> {
    return resStatus("hello", 1);
  }

  async sendEmail(data: EmailDTO): Promise<TStatusRes<null>> {
    const here = await this.mailerService.sendMail({
      from: `YourVocabularyApp`,
      to: data.email,
      subject: 'Authorization in YourVocabulary',
      text:'Hello everybody!'
    });
    console.log(here)
    return resStatus(null, 1, "", "Message was sent");
  }
}