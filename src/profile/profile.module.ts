import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";

@Module({
  controllers:[ProfileController],
  providers:[ProfileService],
  imports:[AuthModule]
})
export class ProfileModule {}