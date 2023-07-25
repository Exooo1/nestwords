import { TStatusRes } from "../utils/status";

export type TProfileInfo = {
  totalWords: number;
  days: number;
  notes: number;
  firstName: string;
  lastName: string;
  avatar: string;
};

export interface IProfile {
  getProfile(token: string): Promise<TStatusRes<TProfileInfo>>;

  setAvatar(token: string,avatar:string): Promise<TStatusRes<string>>;
}