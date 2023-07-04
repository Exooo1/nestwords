import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes } from "mongoose";


export type TAccountDocument = Account & Document;

@Schema()
class Word {

  @Prop( { type: String, trim: true })
  word: string;

  @Prop( { type: String, trim: true })
  translate: string;

  @Prop( { type: String, trim: true })
  description: string;

  @Prop( { type: String, trim: true })
  added: string;
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

  @Prop(raw({
    firstName: { type: String },
    lastName: { type: String },
    totalWords: { type: Number },
    words: {
      a: { type: Array<Word> },
      b: { type: Array<Word> },
      c: { type: Array<Word> },
      d: { type: Array<Word> },
      e: { type: Array<Word> },
      f: { type: Array<Word> },
      g: { type: Array<Word> },
      h: { type: Array<Word> },
      i: { type: Array<Word> },
      j: { type: Array<Word> },
      k: { type: Array<Word> },
      l: { type: Array<Word> },
      m: { type: Array<Word> },
      n: { type: Array<Word> },
      o: { type: Array<Word> },
      p: { type: Array<Word> },
      q: { type: Array<Word> },
      r: { type: Array<Word> },
      s: { type: Array<Word> },
      t: { type: Array<Word> },
      u: { type: Array<Word> },
      v: { type: Array<Word> },
      w: { type: Array<Word> },
      x: { type: Array<Word> },
      y: { type: Array<Word> },
      z: { type: Array<Word> },
    }
  }))
  profile: any;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
