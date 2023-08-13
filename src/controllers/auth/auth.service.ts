import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { Account, TAccountDocument } from "../../schemas/auth/account.schema";
import { InjectModel } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";
import { IAccountProfile, IAccount } from "../../schemas/auth/types";
import { resStatus, TStatusRes } from "../../utils/status";
import { EmailDTO, LoginDTO, SignUpDTO } from "./auth.dto";
import { MailerService } from "@nestjs-modules/mailer";
import { Model } from "mongoose";
import { IAuthService, TLoginRes, TNewPassword } from "./types";
import { SchedulerRegistry } from "@nestjs/schedule";
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService implements IAuthService {
  readonly profile: IAccountProfile = {
    avatar: "default.png",
    days: [],
    notes: 0,
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

  deleteTimeoutAuth(id: string) {
    this.schedulerRegistry.deleteTimeout(id);
    this.logger.warn(`Timeout ${id} deleted!`);
  }

  setTimeoutAuth(id: string, milliseconds: number) {
    const interval = setTimeout(async () => {
      this.authModel.deleteOne({ _id: id, verify: 0 });
      this.deleteTimeoutAuth(id);
    }, milliseconds);
    this.schedulerRegistry.addTimeout(id, interval);
  }

  constructor(
    @InjectModel(Account.name)
    private readonly authModel: Model<TAccountDocument>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private schedulerRegistry: SchedulerRegistry
  ) {
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
        verify: newAccount._id.toString(),
        name: firstName,
        email
      }, "create");
      this.setTimeoutAuth(newAccount._id, 900_000);
      if (mail.resultCode) {
        this.logger.log(`Account was created - ${email}`);
        return resStatus<null>(null, 1, "", "Account was created.");
      } else throw new HttpException(mail.error, HttpStatus.FORBIDDEN);
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

  async login(data: LoginDTO): Promise<TStatusRes<TLoginRes>> {
    try {
      const { email, password } = data;
      const account = await this.authModel.findOne({ email }) as IAccount;
      if (!account) throw new HttpException("You aren't authorized!", HttpStatus.UNAUTHORIZED);
      const validPassword = await bcrypt.compare(password, account.password);
      if (!validPassword) throw  new HttpException("Email or password is incorrect", HttpStatus.FORBIDDEN);
      if (!account.verify) throw new HttpException("Please confirm your email", HttpStatus.CONFLICT);
      await this.authModel.updateOne({ email }, { auth: 1 });
      return resStatus<TLoginRes>({ token: this.jwtService.sign({ id: account._id }), auth: 1 }, 1);
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

  async sendEmail(data: EmailDTO, type: string): Promise<TStatusRes<null>> {
    try {
      const { name, email, verify } = data;
      await this.mailerService.sendMail({
        to: email,
        subject: "Accept registration",
        template: type === "create" ? "email" : "password",
        context: {
          username: name,
          verify
        }
      });
      return resStatus<null>(null, 1, "", "Message was sent");
    } catch (err) {
      const error = err as Error;
      throw new HttpException(error.message, HttpStatus.PRECONDITION_FAILED);
    }
  }

  async confirm(id: string): Promise<TStatusRes<string>> {
    try {
      const account = await this.authModel.findOne({ _id: id });
      if (!account) throw new HttpException("NotFound", HttpStatus.NOT_FOUND);
      if (account.verify) throw new HttpException("Account already verified", HttpStatus.BAD_REQUEST);
      await this.authModel.updateOne({ _id: id }, { verify: 1 });
      return resStatus<string>("Email confirmed successfully", 1);
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

  async me(id: string): Promise<TStatusRes<number>> {
    try {
      const account = await this.authModel.findOne({ _id: id });
      if (!account) throw new HttpException("NotFound", HttpStatus.NOT_FOUND);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayDate = account.profile.days.find(el => el === yesterday.toLocaleDateString());
      if (!yesterdayDate) account.profile.days = [];
      const todayDate = account.profile.days.find(el => el === today.toLocaleDateString());
      if (!todayDate) account.profile.days.push(today.toLocaleDateString());
      await account.save();
      return resStatus<number>(account.auth, 1);
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

  async logOut(id: string): Promise<TStatusRes<number>> {
    try {
      await this.authModel.updateOne({ _id: id }, { auth: 0 });
      return resStatus<number>(0, 0);
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

  async changePassword(email: string): Promise<TStatusRes<null>> {
    try {
      const account = await this.authModel.findOne({ email }) as IAccount;
      if (!account) throw new HttpException("NotFound account!", HttpStatus.NOT_FOUND);
      const mail = await this.sendEmail({
        name: account.profile.firstName,
        email: account.email,
        verify: account._id
      }, "");
      if (mail.resultCode) {
        this.logger.log(`Changed password - ${mail}`);
        return resStatus<null>(null, 1, "", "We sent the letter you");
      } else throw new HttpException(mail.error, HttpStatus.FORBIDDEN);
      return resStatus<null>(null, 1);
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

  async newPassword(data: TNewPassword): Promise<TStatusRes<null>> {
    try {
      const { id, password } = data;
      const account = await this.authModel.findByIdAndUpdate({ _id: id }, { "password": await bcrypt.hash(password, 11) }) as IAccount;
      if (!account) throw new HttpException("NotFound account!", HttpStatus.NOT_FOUND);
      account.save;
      return resStatus<null>(null, 1);
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
