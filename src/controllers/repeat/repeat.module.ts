import { Module } from '@nestjs/common';
import { RepeatService } from './repeat.service';
import { RepeatController } from './repeat.controller';
import { AuthModule } from "../auth/auth.module";

@Module({
  imports:[AuthModule],
  controllers: [RepeatController],
  providers: [RepeatService]
})
export class RepeatModule {}
