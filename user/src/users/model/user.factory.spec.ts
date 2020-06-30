import uuid from 'uuid';
import { ModuleMetadata, Provider } from '@nestjs/common/interfaces';
import { Test } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';

import UserFactory from '@src/users/model/user.factory';
import User from '@src/users/model/user';
import UserCreatedEvent from '@src/users/event/created';
import AccountService from '@src/users/service/account';
import UserRepository from '@src/users/repository/user.repository';
import UserEntity from '@src/users/entity/user';

describe('UserFactory', () => {
  let moduleMetaData: ModuleMetadata;
  let userFactory: UserFactory;
  let userRepository: UserRepository;
  let accountService: AccountService;

  beforeAll(async () => {
    const httpServiceProvider: Provider = { provide: HttpService, useValue: {} };
    const providers: Provider[] = [
      UserFactory,
      AccountService,
      UserRepository,
      httpServiceProvider,
    ];

    moduleMetaData = { providers };
    const testModule = await Test.createTestingModule(moduleMetaData).compile();

    userFactory = testModule.get(UserFactory);
    userRepository = testModule.get(UserRepository);
    accountService = testModule.get(AccountService);

    global.Date.now = Date.now;
  });

  describe('create', () => {
    it('should return User model', () => {
      const randomId = 'randomId';
      const email = 'test@email.com';
      const password = 'password';
      const createdAt = new Date();
      const updatedAt = null;
      const deletedAt = null;

      const user = new User(randomId, email, password, createdAt, updatedAt, deletedAt);

      const userCreatedEvent = new UserCreatedEvent(randomId, randomId, email, password, null);

      jest.spyOn(uuid, 'v1').mockReturnValue(randomId);

      user.apply(userCreatedEvent);

      expect(userFactory.create(email, password)).toBeInstanceOf(User);
    });
  });

  describe('reconstitute', () => {
    it('should return User model', async () => {
      const userId = 'userId';
      const email = 'test@email.com';
      const password = 'password';
      const createdAt = new Date();

      const userEntity = new UserEntity(userId);
      const user = new User(userId, email, password, createdAt, null, null);

      const account = {
        id: 'accountId',
        userId,
        email,
        password,
      };

      jest.spyOn(userRepository, 'findById').mockResolvedValue(userEntity);
      jest.spyOn(accountService, 'findByUserIds').mockResolvedValue([account]);

      await expect(userFactory.reconstitute(userId)).resolves.toEqual(user);
    });
  });
});
