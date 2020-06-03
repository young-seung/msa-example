import { ModuleMetadata } from '@nestjs/common/interfaces';
import { EventPublisher } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';

import UpdateUserCommandHandler from '@src/users/command/update.handler';
import UserFactory from '@src/users/model/user.factory';
import UserEntity from '@src/users/entity/user';
import User from '@src/users/model/user';
import UpdateUserCommand from '@src/users/command/update';
import UpdateUserCommandResult from '@src/users/command/update.result';

describe('UpdateUserHandler', () => {
  let moduleMetaData: ModuleMetadata;
  let eventPublisher: EventPublisher;
  let updateUserCommandHandler: UpdateUserCommandHandler;
  let userFactory: UserFactory;
  let userRepository: Repository<UserEntity>;

  beforeAll(async () => {
    moduleMetaData = {
      providers: [
        { provide: EventPublisher, useValue: { mergeObjectContext: (): null => null } },
        { provide: UserFactory, useValue: { reconstitute: (): null => null } },
        { provide: 'UserEntityRepository', useClass: Repository },
        UpdateUserCommandHandler,
      ],
    };
    const testModule = await Test.createTestingModule(moduleMetaData).compile();
    updateUserCommandHandler = testModule.get(UpdateUserCommandHandler);
    userFactory = testModule.get(UserFactory);
    userRepository = testModule.get('UserEntityRepository');
    eventPublisher = testModule.get(EventPublisher);
  });

  describe('update', () => {
    it('should return UpdateUserCommandHandler', () => {
      const userId = 'userId';
      const email = 'test@email.com';
      const password = 'password';
      const createdAt = new Date();
      const updatedAt = null;
      const deletedAt = null;

      const user = new User(userId, email, password, createdAt, updatedAt, deletedAt);

      jest.spyOn(userFactory, 'reconstitute').mockResolvedValue(user);
      jest.spyOn(eventPublisher, 'mergeObjectContext').mockReturnValue(user);
      jest.spyOn(userRepository, 'save').mockResolvedValue(user.toEntity());

      const command: UpdateUserCommand = { userId, password };
      const result: UpdateUserCommandResult = {};

      expect(updateUserCommandHandler.execute(command)).resolves.toEqual(result);
    });
  });
});
