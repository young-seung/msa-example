import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { EventPublisher } from '@nestjs/cqrs';

import CreateUserCommandHandler from '@src/users/command/create.handler';
import UserFactory from '@src/users/model/user.factory';
import UserEntity from '@src/users/entity/user';
import User from '@src/users/model/user';
import CreateUserCommand from '@src/users/command/create';
import CreateUserCommandResult from '@src/users/command/create.result';

describe('CreateUserCommandHandler', () => {
  let moduleMetaData: ModuleMetadata;
  let createUserCommandHandler: CreateUserCommandHandler;
  let userFactory: UserFactory;
  let userRepository: Repository<UserEntity>;
  let eventPublisher: EventPublisher;

  beforeAll(async () => {
    moduleMetaData = {
      providers: [
        { provide: EventPublisher, useValue: { mergeObjectContext: (): null => null } },
        { provide: UserFactory, useValue: { create: (): null => null } },
        { provide: 'UserEntityRepository', useValue: { save: (): null => null } },
        CreateUserCommandHandler,
      ],
    };
    const testModule = await Test.createTestingModule(moduleMetaData).compile();
    createUserCommandHandler = testModule.get(CreateUserCommandHandler);
    userFactory = testModule.get(UserFactory);
    userRepository = testModule.get('UserEntityRepository');
    eventPublisher = testModule.get(EventPublisher);
  });

  describe('execute', () => {
    it('should return CreateUserCommandResult', () => {
      const userId = 'userId';
      const email = 'test@email.com';
      const password = 'password';
      const createdAt = new Date();
      const updatedAt = null;
      const deletedAt = null;

      const user = new User(userId, email, password, createdAt, updatedAt, deletedAt);
      const userEntity = new UserEntity(userId);

      jest.spyOn(userFactory, 'create').mockReturnValue(user);
      jest.spyOn(eventPublisher, 'mergeObjectContext').mockReturnValue(user);
      jest.spyOn(userRepository, 'save').mockResolvedValue(userEntity);

      const command: CreateUserCommand = { email, password };
      const result: CreateUserCommandResult = {};

      expect(createUserCommandHandler.execute(command)).resolves.toEqual(result);
    });
  });
});
