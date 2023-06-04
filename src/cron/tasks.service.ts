import { Injectable, Logger } from '@nestjs/common';
import { Cron} from "@nestjs/schedule";
import { InjectModel } from "@nestjs/mongoose";
import { Account, TAccountDocument } from "../schemas/auth/account.schema";
import { Model } from "mongoose";

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(@InjectModel(Account.name) private readonly authModel: Model<TAccountDocument>) {}

  @Cron('*/15 * * * *',{
    name:'RemoveUnnecessaryUsers',
    timeZone:'Europe/Moscow',
  })
  async handleCron() {
    await this.authModel.findOneAndRemove({verify:0})
    this.logger.log('Removed unnecessary users');
  }
}