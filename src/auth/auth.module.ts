import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { Account, AccountSchema } from "../schemas/auth/account.schema";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>("JWT_SECRET"),
          signOptions: {
            expiresIn: config.get<string | number>("JWT_EXPIRE")
          }
        };
      }
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          transport: {
            host: "smtp.gmail.com",
            auth: {
              user: config.get<string>("LOGIN"),
              pass: config.get<string>("PASSWORD")
            }
          }
        };
      }
    }),
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }])
  ],
  providers: [AuthService, ConfigService],
  controllers: [AuthController]
})
export class AuthModule {
}