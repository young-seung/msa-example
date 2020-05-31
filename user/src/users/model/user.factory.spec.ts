import uuid from 'uuid';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Test } from '@nestjs/testing';

import UserFactory from '@src/users/model/user.factory';
import User from '@src/users/model/user.model';
import UserCreatedEvent from '@src/users/event/created';

describe('UserFactory', () => {
  let moduleMetaData: ModuleMetadata;
  let userFactory: UserFactory;

  beforeAll(async () => {
    moduleMetaData = { providers: [UserFactory] };
    const testModule = await Test.createTestingModule(moduleMetaData).compile();
    userFactory = testModule.get(UserFactory);

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

      const userCreatedEvent = new UserCreatedEvent(
        randomId,
        randomId,
        email,
        password,
        null,
        createdAt,
        updatedAt,
        deletedAt,
      );

      jest.spyOn(uuid, 'v1').mockReturnValue(randomId);

      user.apply(userCreatedEvent);

      expect(userFactory.create(email, password)).toBeInstanceOf(User);
    });
  });
});
