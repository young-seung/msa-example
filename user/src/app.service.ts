import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createConnection, Connection } from 'typeorm';

import AppConfiguration from '@src/app.config';
import UserEntity from '@src/users/entity/user';
import EventEntity from '@src/users/entity/event';

@Injectable()
export default class ApplicationService implements OnModuleInit, OnModuleDestroy {
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
