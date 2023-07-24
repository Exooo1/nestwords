import { MiddlewareConsumer, Module } from "@nestjs/common";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerMiddleware } from "./middleware/logger.middleware";
import { WordsModule } from "./words/words.module";
import { ProfileModule } from "./profile/profile.module";

@Module({
  imports: [
    ProfileModule,
    WordsModule,
    AuthModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('DB_URL_MONGO'),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('auth','profile','words');
  }
}
