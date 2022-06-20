import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { urlencoded, json } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { API_PREFIX } from './__shared__/consts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix(API_PREFIX);

  app.enableCors({
    origin: configService.get('CLIENT_ORIGIN'),
    credentials: true,
  });

  app.use(json({ limit: '2mb' }));
  app.use(urlencoded({ extended: true, limit: '2mb' }));

  const options = new DocumentBuilder()
    .setTitle('Twitterapp API')
    .setDescription('Twitterapp REST Full API')
    .addBasicAuth()
    .addBearerAuth()
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Users')
    .addTag('Tweets')
    .addTag('Subscriptions')
    .addTag('Likes')
    .addTag('Metrics')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(API_PREFIX, app, document);

  app.enableShutdownHooks();
  await app.listen(3000);
}

bootstrap();

// @ApiBasicAuth()
// @ApiBearerAuth()
// @Controller('cats')
