import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/utils/HttpExceptionFilter';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(bodyParser.json());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();

  await app.listen(9229);

}
bootstrap();
