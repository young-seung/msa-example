import {
  Injectable, OnModuleInit, OnModuleDestroy, INestApplication,
} from '@nestjs/common';
import { createConnection, Connection } from 'typeorm';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import RateLimit from 'express-rate-limit';

import AppConfiguration from '@src/app.config';

import UserEntity from '@src/users/entity/user';
import EventEntity from '@src/users/entity/event';
import Publisher from '@src/users/rabbitmq/publisher';

@Injectable()
export default class ApplicationService implements OnModuleInit, OnModuleDestroy {
  public readonly setUp = async (app: INestApplication): Promise<void> => {
    this.swaggerSetUp(app);
    this.middlewareSetUp(app);
    await this.messagePublisherSetUp(app);
    await app.listen(AppConfiguration.PORT);
  };

  private readonly rateLimit = (): RateLimit.Instance => {
    const windowMs = 15 * 60 * 1000;
    const max = 100;

    const rateLimitOptions: RateLimit.Options = { windowMs, max };
    return new RateLimit(rateLimitOptions);
  };

  private readonly middlewareSetUp = (app: INestApplication): void => {
    app.use(helmet());
    app.use(compression());
    app.use(this.rateLimit());
  };

  private readonly swaggerSetUp = (app: INestApplication): void => {
    const options = new DocumentBuilder()
      .setTitle('User service swagger')
      .addBearerAuth('Authorization', 'header')
      .build();

    const document = SwaggerModule.createDocument(app, options);
    return SwaggerModule.setup('api', app, document);
  };

  private readonly messagePublisherSetUp = async (app: INestApplication): Promise<void> => {
    const messagePublisher = app.get(Publisher);
    return messagePublisher.setUp();
  };

  private connection: Connection | undefined;

  public async onModuleInit(): Promise<void> {
    const entities = [UserEntity, EventEntity];
    const databaseOptions = { ...AppConfiguration.database, entities };
    this.connection = await createConnection(databaseOptions);
    if (!this.connection) process.exit(1);
  }

  public async onModuleDestroy(): Promise<void> {
    if (!this.connection) process.exit(1);
    await this.connection.close();
  }
}
