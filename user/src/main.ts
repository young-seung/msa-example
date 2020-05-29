import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import RateLimit from 'express-rate-limit';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import compression from 'compression';

import ApplicationModule from '@src/app.module';
import Producer from '@src/users/message/producer';
import Consumer from '@src/users/message/consumer';
import AppConfiguration from '@src/app.config';

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

  const messageProducer = app.get(Producer);
  const messageConsumer = app.get(Consumer);

  await messageProducer.setUp();
  await messageConsumer.setUp();
  await messageConsumer.consumeFromQueue();

  await app.listen(AppConfiguration.PORT);
}
bootstrap();
