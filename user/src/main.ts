import { NestFactory } from '@nestjs/core';
import { InternalServerErrorException } from '@nestjs/common';

import ApplicationModule from '@src/app.module';
import ApplicationService from '@src/app.service';

function exitProcess(error: Error): never {
  throw new InternalServerErrorException(error);
  return process.exit(1);
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(ApplicationModule, { cors: true });

  const appService = app.get(ApplicationService);

  await appService.setUp(app).catch(exitProcess);
}

bootstrap();
