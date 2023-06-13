import { EmailDTO, LoginDTO, SignUpDTO } from "./auth.dto";
import { TStatusRes } from "../utils/status";
import { CAccountProfile } from "../schemas/auth/types";

export interface IAuthController {
  signUp: (data: SignUpDTO) => Promise<TStatusRes<string>>;
}

export interface IAuthService {
  profile: CAccountProfile;
  signUp: (data: SignUpDTO) => Promise<TStatusRes<string>>;
  sendEmail: (data: EmailDTO) => Promise<TStatusRes<null>>;
  login: (data: LoginDTO) => Promise<TStatusRes<string>>;
  confirm: (data: string) => Promise<TStatusRes<string>>;
  me: (data: string) => Promise<TStatusRes<number>>;
  logOut: (data: string) => Promise<TStatusRes<number>>;
}
