import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';

import CreateUserCommandHandler from '@src/users/command/create.handler';
import UserFactory from '@src/users/model/user.factory';
import UserEntity from '@src/users/entity/user';
import Producer from '@src/users/message/producer';
import User from '@src/users/model/user.model';
import CreateUserCommand from '@src/users/command/create';
import CreateUserCommandResult from '@src/users/command/create.result';

describe('CreateUserCommandHandler', () => {
  let moduleMetaData: ModuleMetadata;
  let createUserCommandHandler: CreateUserCommandHandler;
  let userFactory: UserFactory;
  let userRepository: Repository<UserEntity>;

  beforeAll(async () => {
    moduleMetaData = {
      providers: [
        UserFactory,
        { provide: 'UserEntityRepository', useClass: Repository },
        Producer,
        CreateUserCommandHandler,
      ],
    };
    const testModule = await Test.createTestingModule(moduleMetaData).compile();
    createUserCommandHandler = testModule.get('CreateUserCommandHandler');
    userFactory = testModule.get('UserFactory');
    userRepository = testModule.get('UserEntityRepository');
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
      jest.spyOn(userRepository, 'save').mockResolvedValue(userEntity);

      const command: CreateUserCommand = { email, password };
      const result: CreateUserCommandResult = {};

      expect(createUserCommandHandler.execute(command)).resolves.toEqual(result);
    });
  });
});
