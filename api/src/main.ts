import { ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';

import { AppModule } from './app.module';
import { API_PREFIX } from './__shared__/consts';
import { ValidationPipe } from './__shared__/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix(API_PREFIX);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.enableCors({
    origin: configService.get('CLIENT_ORIGIN'),
    credentials: true,
  });

  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ extended: true, limit: '1mb' }));

  const options = new DocumentBuilder()
    .setTitle('Twitterapp API')
    .setDescription('Twitterapp REST Full API')
    .addBasicAuth()
    .addBearerAuth()
    .setVersion('1.0')
    //
    .addTag('Metrics')
    .addTag('Auth')
    //
    .addTag('Users')
    .addTag('Subscriptions')
    .addTag('Bans')
    .addTag('Reports')
    //
    .addTag('Statuses')
    .addTag('Likes')
    .addTag('Trends')
    .addTag('Feeds')
    .addTag('Notifications')
    //
    .addTag('Timeline')
    //
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(API_PREFIX, app, document);

  app.enableShutdownHooks();
  await app.listen(3000);
}

bootstrap();
