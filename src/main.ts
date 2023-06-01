import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "./exception/custom.exception";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({
    disableErrorMessages: false, //показывает ошибки если какие то свойства не были заполненены корректно в DTO
    whitelist: true, //сортирует лишние данные которые прихоядт в DTO
    forbidNonWhitelisted: true,// показывает ошики если есть лишние входные данне в DTO
    // transform:true преобразует отправляемый тип в указанный тип в DTO
  }));
  await app.listen(8080);
}
bootstrap();
