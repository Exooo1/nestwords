import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { CAccountProfile } from "./types";

export type TAccountDocument = Account & Document

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

  @Prop({ trim: true, type: CAccountProfile })
  profile: CAccountProfile
}

export const AccountSchema = SchemaFactory.createForClass(Account)