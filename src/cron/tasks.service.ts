import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression, Interval, SchedulerRegistry } from "@nestjs/schedule";
import { InjectModel } from "@nestjs/mongoose";
import { Account, TAccountDocument } from "../schemas/auth/account.schema";
import { Model } from "mongoose";

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectModel(Account.name)
    private readonly authModel: Model<TAccountDocument>,
    private schedulerRegistry: SchedulerRegistry
  ) {
  }

  // @Cron(CronExpression.EVERY_5_SECONDS)
  // async handleCron() {
  //   const timeouts = this.schedulerRegistry.getTimeouts();
  //   timeouts.forEach(key => console.log(`Timeout Name: ${key}`))
  // }

}
