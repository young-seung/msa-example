import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Test } from '@nestjs/testing';
import { EventPublisher } from '@nestjs/cqrs';

import CreateUserCommandHandler from '@src/users/command/create.handler';
import UserFactory from '@src/users/model/user.factory';
import UserEntity from '@src/users/entity/user';
import User from '@src/users/model/user';
import CreateUserCommand from '@src/users/command/create';
import CreateUserCommandResult from '@src/users/command/create.result';
import UserRepository from '@src/users/repository/user.repository';

describe('CreateUserCommandHandler', () => {
  let moduleMetaData: ModuleMetadata;
  let createUserCommandHandler: CreateUserCommandHandler;
  let userFactory: UserFactory;
  let userRepository: UserRepository;
  let eventPublisher: EventPublisher;

  beforeAll(async () => {
    moduleMetaData = {
      providers: [
        { provide: EventPublisher, useValue: { mergeObjectContext: (): null => null } },
        { provide: UserFactory, useValue: { create: (): null => null } },
        { provide: UserRepository, useValue: { save: (): null => null } },
        CreateUserCommandHandler,
      ],
    };
    const testModule = await Test.createTestingModule(moduleMetaData).compile();
    createUserCommandHandler = testModule.get(CreateUserCommandHandler);
    userFactory = testModule.get(UserFactory);
    userRepository = testModule.get(UserRepository);
    eventPublisher = testModule.get(EventPublisher);
  });

  describe('execute', () => {
    it('should return CreateUserCommandResult', async () => {
      const userId = 'userId';
      const email = 'test@email.com';
      const password = 'password';
      const name = 'name';
      const createdAt = new Date();
      const updatedAt = null;
      const deletedAt = null;

      const user = new User(userId, email, password, name, createdAt, updatedAt, deletedAt);
      const userEntity = new UserEntity(userId);

      jest.spyOn(userFactory, 'create').mockReturnValue(user);
      jest.spyOn(eventPublisher, 'mergeObjectContext').mockReturnValue(user);
      jest.spyOn(userRepository, 'save').mockResolvedValue(userEntity);

      const command: CreateUserCommand = { email, password, name };
      const result: CreateUserCommandResult = {};

      await expect(createUserCommandHandler.execute(command)).resolves.toEqual(result);
    });
  });
});
