import { EmailDTO, LoginDTO, SignUpDTO } from "./auth.dto";
import { TStatusRes } from "../utils/status";
import { IAccountProfile } from "../schemas/auth/types";

export interface IAuthController {
  signUp: (data: SignUpDTO) => Promise<TStatusRes<string>>;
}

export interface IAuthService {
  profile: IAccountProfile;
  signUp: (data: SignUpDTO) => Promise<TStatusRes<string>>;
  sendEmail: (data: EmailDTO, type: string) => Promise<TStatusRes<null>>;
  login: (data: LoginDTO) => Promise<TStatusRes<TLoginRes>>;
  confirm: (data: string) => Promise<TStatusRes<string>>;
  me: (data: string) => Promise<TStatusRes<number>>;
  logOut: (data: string) => Promise<TStatusRes<number>>;
  setTimeoutAuth: (id: string, milliseconds: number) => void;
  deleteTimeoutAuth: (id: string) => void;
  changePassword: (email: string) => Promise<TStatusRes<null>>;
}

export type TLoginRes = {
  token: string
  auth: number
}

export type TUserToken = {
  user: string
}
