export type TAccountWord = {
  word: string;
  translate: string;
  description: string;
  added: string;
};

export interface IAccountProfile {
   readonly firstName: string;
   readonly lastName: string;
   totalWords: number;
   words: {
    a: TAccountWord[];
    b: TAccountWord[];
    c: TAccountWord[];
    d: TAccountWord[];
    e: TAccountWord[];
    f: TAccountWord[];
    g: TAccountWord[];
    h: TAccountWord[];
    i: TAccountWord[];
    j: TAccountWord[];
    k: TAccountWord[];
    l: TAccountWord[];
    m: TAccountWord[];
    n: TAccountWord[];
    o: TAccountWord[];
    p: TAccountWord[];
    q: TAccountWord[];
    r: TAccountWord[];
    s: TAccountWord[];
    t: TAccountWord[];
    u: TAccountWord[];
    v: TAccountWord[];
    w: TAccountWord[];
    x: TAccountWord[];
    y: TAccountWord[];
    z: TAccountWord[];
  };
}

export interface IAccount {
  _id: string;
  created: string;
  verify: number;
  auth: number;
  email: string;
  password: string;
  profile: IAccountProfile;
  save: () => void;
}
