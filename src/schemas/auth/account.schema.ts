import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type TAccountDocument = Account & Document;

@Schema()
class Word {
  @Prop({ type: String, trim: true })
  word: string;

  @Prop({ type: String, trim: true })
  translate: string;

  @Prop({ type: String, trim: true })
  description: string;

  @Prop({ type: String, trim: true })
  added: string;
}

@Schema()
export class Letters {
  @Prop([Word])
  a: Word[];

  @Prop([Word])
  b: Word[];

  @Prop([Word])
  c: Word[];

  @Prop([Word])
  d: Word[];

  @Prop([Word])
  e: Word[];

  @Prop([Word])
  f: Word[];

  @Prop([Word])
  g: Word[];

  @Prop([Word])
  h: Word[];

  @Prop([Word])
  i: Word[];

  @Prop([Word])
  j: Word[];

  @Prop([Word])
  k: Word[];

  @Prop([Word])
  l: Word[];

  @Prop([Word])
  m: Word[];

  @Prop([Word])
  n: Word[];

  @Prop([Word])
  o: Word[];

  @Prop([Word])
  p: Word[];

  @Prop([Word])
  q: Word[];

  @Prop([Word])
  r: Word[];

  @Prop([Word])
  s: Word[];

  @Prop([Word])
  t: Word[];

  @Prop([Word])
  u: Word[];

  @Prop([Word])
  v: Word[];

  @Prop([Word])
  w: Word[];

  @Prop([Word])
  x: Word[];

  @Prop([Word])
  y: Word[];

  @Prop([Word])
  z: Word[];
}

@Schema()
export class Profile {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: Number, required: true })
  totalWords: number;

  @Prop(Letters)
  words: Letters;

  @Prop({ type: String, default: "default.png"})
  avatar: string;

  @Prop([String])
  days: Array<string>;

  @Prop({ type: Number, default: 0, required: true })
  notes: number;
}


@Schema({ timestamps: true })
export class Account {
  @Prop({ required: true, trim: true })
  created: string;

  @Prop({ default: 0, trim: true })
  verify: number;

  @Prop({ default: 0, trim: true })
  auth: number;

  @Prop({ required: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  password: string;

  @Prop(Profile)
  profile: Profile;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
