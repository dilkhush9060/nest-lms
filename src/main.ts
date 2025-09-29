import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('LMS API')
    .setDescription('The LMS API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('http://localhost:5000', 'Local server')
    .addServer('https://lms.example.com', 'Production server')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/reference',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    apiReference({
      content: document,
      darkMode: true,
      theme: 'kepler',
      defaultHttpClient: {
        clientKey: 'axios',
        targetKey: 'js',
      },
    }),
  );

  await app.listen(process.env.PORT ?? 5000);
}

void bootstrap();
