import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "./exception/custom.exception";
import { CustomLogger } from "./logger/logger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    logger: new CustomLogger()
  });
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({
    disableErrorMessages: false, //показывает ошибки если какие то свойства не были заполненены корректно в DTO
    whitelist: true, //сортирует лишние данные которые прихоядт в DTO
    forbidNonWhitelisted: true// показывает ошики если есть лишние входные данне в DTO
    // transform:true преобразует отправляемый тип в указанный тип в DTO
  }));
  await app.listen(8080);
}

bootstrap();
