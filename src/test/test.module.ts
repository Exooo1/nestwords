import { Module } from "@nestjs/common";
import { TestService } from "./test.service";
import { TestController } from "./test.controller";
import { AuthModule } from "../controllers/auth/auth.module";


@Module({
  imports:[AuthModule],
  controllers:[TestController],
  providers:[TestService]
})

export class TestModule {}
