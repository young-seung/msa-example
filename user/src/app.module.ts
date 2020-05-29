import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import AppController from '@src/app.controller';
import AppConfiguration from '@src/app.config';
import UsersController from '@src/users/users.controller';
import User from '@src/users/entity/user';
import CreateUserCommandHandler from '@src/users/command/create.handler';
import UpdateUserCommandHandler from '@src/users/command/update.handler';
import DeleteUserCommandHandler from '@src/users/command/delete.handler';
import UserUpdatedEventHandler from '@src/users/event/updated.handler';
import Event from '@src/users/entity/event';
import Producer from '@src/users/message/producer';
import Consumer from '@src/users/message/consumer';
import UserFactory from '@src/users/model/user.factory';

const commandHandler = [
  CreateUserCommandHandler,
  UpdateUserCommandHandler,
  DeleteUserCommandHandler,
];

const eventHandler = [UserUpdatedEventHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forRoot({
      type: AppConfiguration.DATABASE_TYPE,
      host: AppConfiguration.DATABASE_HOST,
      port: AppConfiguration.DATABASE_PORT,
      database: AppConfiguration.DATABASE_NAME,
      username: AppConfiguration.DATABASE_USER,
      password: AppConfiguration.DATABASE_PASSWORD,
      synchronize: true,
      logging: true,
      entities: [User, Event],
    }),
    TypeOrmModule.forFeature([User, Event]),
  ],
  controllers: [AppController, UsersController],
  providers: [Producer, Consumer, UserFactory, ...commandHandler, ...eventHandler],
})
export default class ApplicationModule {
  constructor(private readonly connection: Connection) {}
}
