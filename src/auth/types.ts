import { EmailDTO, SignUpDTO } from './auth.dto';
import { TStatusRes } from '../utils/status';
import { CAccountProfile } from "../schemas/auth/types";

export interface IAuthController {
  signUp: (data: SignUpDTO) => Promise<TStatusRes<string>>;
}

export interface IAuthService {
  profile: CAccountProfile;
  signUp: (data: SignUpDTO) => Promise<TStatusRes<string>>;
  sendEmail: (data: EmailDTO) => Promise<TStatusRes<null>>;
  login: () => Promise<TStatusRes<string>>;
}
