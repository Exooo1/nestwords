import { EmailDTO, SignUpDTO } from './auth.dto';
import { TStatusRes } from '../utils/status';
import { TAccountWord } from '../schemas/auth/types';

export interface IAuthController {
  signUp: (data: SignUpDTO) => Promise<TStatusRes<string>>;
}

type TProfile = {
  firstName: string;
  lastName: string;
  totalWords: number;
  words: {
    a: Array<TAccountWord>;
    b: Array<TAccountWord>;
    c: Array<TAccountWord>;
    d: Array<TAccountWord>;
    e: Array<TAccountWord>;
    f: Array<TAccountWord>;
    g: Array<TAccountWord>;
    h: Array<TAccountWord>;
    i: Array<TAccountWord>;
    j: Array<TAccountWord>;
    k: Array<TAccountWord>;
    l: Array<TAccountWord>;
    m: Array<TAccountWord>;
    n: Array<TAccountWord>;
    o: Array<TAccountWord>;
    p: Array<TAccountWord>;
    q: Array<TAccountWord>;
    r: Array<TAccountWord>;
    s: Array<TAccountWord>;
    t: Array<TAccountWord>;
    u: Array<TAccountWord>;
    v: Array<TAccountWord>;
    w: Array<TAccountWord>;
    x: Array<TAccountWord>;
    y: Array<TAccountWord>;
    z: Array<TAccountWord>;
  };
};

export interface IAuthService {
  profile: TProfile;
  signUp: (data: SignUpDTO) => Promise<TStatusRes<string>>;
  sendEmail: (data: EmailDTO) => Promise<TStatusRes<null>>;
  login: () => Promise<TStatusRes<string>>;
}
