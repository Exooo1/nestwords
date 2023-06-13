import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { Account, TAccountDocument } from "../schemas/auth/account.schema";
import { InjectModel } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";
import { CAccountProfile, IAccount } from "../schemas/auth/types";
import { resStatus, TStatusRes } from "../utils/status";
import { EmailDTO, LoginDTO, SignUpDTO } from "./auth.dto";
import { MailerService } from "@nestjs-modules/mailer";
import { Model } from "mongoose";
import { IAuthService } from "./types";
import * as bcrypt from "bcryptjs";

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
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(Account.name)
    private readonly authModel: Model<TAccountDocument>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService
  ) {
  }

  async validateUser(data) {
    const user = await this.authModel.findOne({ email: data.username }) as IAccount;
    if (user && await bcrypt.compare(data.password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null
  }

  async signUp(data: SignUpDTO): Promise<TStatusRes<string>> {
    try {
      const { email, password, firstName, lastName } = data;
      const account = await this.authModel.findOne({ email }).exec();
      if (account)
        throw new HttpException("Email already exists", HttpStatus.CONFLICT);
      const hashedPassword = await bcrypt.hash(password, 11);
      const newAccount = (await this.authModel.create({
        email,
        password: hashedPassword,
        profile: { ...this.profile, firstName, lastName },
        created: new Date().toLocaleString()
      })) as IAccount;
      const mail = await this.sendEmail({
        verify: newAccount._id,
        name: firstName,
        email
      });
      if (mail.resultCode) {
        this.logger.log(`Account was created - ${email}`);
        return resStatus<null>(null, 1, "", "Account was created.");
      } else throw new HttpException(mail.error, HttpStatus.FORBIDDEN);
    } catch (err) {
      const error = err as HttpException;
      const status = error?.getStatus();
      if (status) throw new HttpException(error.message, status);
      else
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }

  async login(data: LoginDTO): Promise<TStatusRes<string>> {
    try {
      const { email, password } = data;
      const account = await this.authModel.findOne({ email }).exec() as IAccount;
      if (!account) throw new HttpException("You aren't authorized!", HttpStatus.UNAUTHORIZED);
      const validPassword = await bcrypt.compare(password, account.password);
      if (!validPassword) throw  new HttpException("Email or password is incorrect", HttpStatus.FORBIDDEN);
      if (!account.verify) throw new HttpException("Please confirm your email", HttpStatus.CONFLICT);
      await this.authModel.updateOne({ email }, { auth: 1 });
      return resStatus(this.jwtService.sign({ id: account._id }), 1);
    } catch (err) {
      const error = err as HttpException;
      const status = error?.getStatus();
      if (status) throw new HttpException(error.message, status);
      else
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }

  async sendEmail(data: EmailDTO): Promise<TStatusRes<null>> {
    try {
      const { name, email, verify } = data;
      await this.mailerService.sendMail({
        from: `YourVocabularyApp`,
        to: email,
        subject: "Authorization in YourVocabulary",
        template: "email",
        context: {
          username: name,
          verify: verify
        }
      });
      return resStatus<null>(null, 1, "", "Message was sent");
    } catch (err) {
      const error = err as Error;
      throw new HttpException(error.message, HttpStatus.PRECONDITION_FAILED);
    }
  }
}
