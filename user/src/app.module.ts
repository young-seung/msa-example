import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import AppController from './app.controller';
import AppConfiguration from './app.config';
import UsersController from './users/users.controller';
import User from './users/entity/user';
import CreateUserCommandHandler from './users/command/create.handler';
import UpdateUserCommandHandler from './users/command/update.handler';
import DeleteUserCommandHandler from './users/command/delete.handler';
import UserUpdatedEventHandler from './users/event/updated.handler';
import Event from './users/entity/event';

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
  providers: [...commandHandler, ...eventHandler],
})
export default class ApplicationModule {
  constructor(private readonly connection: Connection) {}
}
