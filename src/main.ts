import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js'
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: `${process.env.API_URL}`,
    credentials:true,
    allowedHeaders: [
        'Accept',
        'Authorization',
        'Content-Type',
        'X-Requested-With',
        'apollo-require-preflight'
    ],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH']
  });
  app.use(cookieParser());
  app.use(graphqlUploadExpress({maxFileSize: 5000000, maxFiles: 10 }));
  // app.useGlobalPipes(
  //     new ValidationPipe({
  //         whitelist: true,
  //         transform: true,
  //     })
  // )



  await app.listen(3000);
}
bootstrap();
