import {
  Injectable, OnModuleInit, OnModuleDestroy, INestApplication,
} from '@nestjs/common';
import { createConnection, Connection } from 'typeorm';

import AppConfiguration from '@src/app.config';

import UserEntity from '@src/users/entity/user';
import EventEntity from '@src/users/entity/event';
import Publisher from '@src/users/rabbitmq/publisher';

@Injectable()
export default class ApplicationService implements OnModuleInit, OnModuleDestroy {
  public readonly setUp = async (app: INestApplication): Promise<void> => {
    const messagePublisher = app.get(Publisher);
    await messagePublisher.setUp();
    await app.listen(AppConfiguration.PORT);
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
