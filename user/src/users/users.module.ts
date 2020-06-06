import { Module, HttpModule } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import UserEntity from '@src/users/entity/user';
import EventEntity from '@src/users/entity/event';
import UsersController from '@src/users/users.controller';
import UserFactory from '@src/users/model/user.factory';
import CreateUserCommandHandler from '@src/users/command/create.handler';
import UpdateUserCommandHandler from '@src/users/command/update.handler';
import DeleteUserCommandHandler from '@src/users/command/delete.handler';
import FindUserByIdQueryHandler from '@src/users/query/findById.handler';
import FindUserQueryHandler from '@src/users/query/find.handler';
import UserCreatedEventHandler from '@src/users/event/created.handler';
import UserUpdatedEventHandler from '@src/users/event/updated.handler';
import UserDeletedEventHandler from '@src/users/event/deleted.handler';
import AccountService from '@src/users/service/account';
import ProfileService from '@src/users/service/profile';
import Producer from '@src/users/rabbitmq/producer';
import Consumer from '@src/users/rabbitmq/consumer';

const commandHandlers = [
  CreateUserCommandHandler,
  UpdateUserCommandHandler,
  DeleteUserCommandHandler,
];

const queryHandlers = [FindUserQueryHandler, FindUserByIdQueryHandler];

const eventHandlers = [UserCreatedEventHandler, UserUpdatedEventHandler, UserDeletedEventHandler];

const services = [AccountService, ProfileService, Producer, Consumer];

const entities = [UserEntity, EventEntity];

@Module({
  imports: [HttpModule, CqrsModule, TypeOrmModule.forFeature(entities)],
  controllers: [UsersController],
  providers: [UserFactory, ...commandHandlers, ...queryHandlers, ...eventHandlers, ...services],
})
export default class UsersModule {}
