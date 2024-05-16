import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js'
import {ValidationPipe} from "@nestjs/common";
import {GqlCustomExceptionFilter} from "../exceptions/graphql.exception";
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.urlencoded({ extended: true }));

  app.enableCors({
    origin: `${process.env.CLIENT_URL}`,
    credentials:true,
    allowedHeaders: [
      'Accept',
      'Authorization',
      'Content-Type',
      'X-Requested-With',
      'apollo-require-preflight',
    ],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    });
  app.use(cookieParser());
  app.use(graphqlUploadExpress({maxFileSize: 5000000, maxFiles: 10 }));

  app.useGlobalPipes(
      new ValidationPipe({
      })
  )

  app.useGlobalFilters(new GqlCustomExceptionFilter());

  await app.listen(process.env.PORT);
}
bootstrap();
