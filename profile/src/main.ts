import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import RateLimit from 'express-rate-limit';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import compression from 'compression';

import ApplicationModule from '@src/app.module';
import AppConfiguration from '@src/app.config';
import Consumer from '@src/profile/infrastructure/message/consumer';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(ApplicationModule, { cors: true });

  const options = new DocumentBuilder()
    .setTitle('nest.js example')
    .setDescription('Nest.js example project')
    .setVersion('1.0')
    .addBearerAuth('Authorization', 'header')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  app.use(helmet());
  app.use(compression());
  app.use(new RateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

  const messageConsumer = app.get(Consumer);

  await messageConsumer.setUp();
  await messageConsumer.consumeFromQueue();

  await app.listen(AppConfiguration.PORT);
}
bootstrap();
