import { ModuleMetadata } from '@nestjs/common/interfaces';
import { EventPublisher } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';

import UpdateUserCommandHandler from '@src/users/command/update.handler';
import UserFactory from '@src/users/model/user.factory';
import User from '@src/users/model/user';
import UpdateUserCommand from '@src/users/command/update';
import UpdateUserCommandResult from '@src/users/command/update.result';
import UserRepository from '@src/users/repository/user.repository';

describe('UpdateUserHandler', () => {
  let moduleMetaData: ModuleMetadata;
  let eventPublisher: EventPublisher;
  let updateUserCommandHandler: UpdateUserCommandHandler;
  let userFactory: UserFactory;
  let userRepository: UserRepository;

  beforeAll(async () => {
    moduleMetaData = {
      providers: [
        { provide: EventPublisher, useValue: { mergeObjectContext: (): null => null } },
        { provide: UserFactory, useValue: { reconstitute: (): null => null } },
        { provide: UserRepository, useClass: Repository },
        UpdateUserCommandHandler,
      ],
    };
    const testModule = await Test.createTestingModule(moduleMetaData).compile();
    updateUserCommandHandler = testModule.get(UpdateUserCommandHandler);
    userFactory = testModule.get(UserFactory);
    userRepository = testModule.get(UserRepository);
    eventPublisher = testModule.get(EventPublisher);
  });

  describe('update', () => {
    it('should return UpdateUserCommandHandler', async () => {
      const userId = 'userId';
      const email = 'test@email.com';
      const password = 'password';
      const name = 'name';
      const createdAt = new Date();
      const updatedAt = null;
      const deletedAt = null;

      const user = new User(userId, email, password, name, createdAt, updatedAt, deletedAt);

      jest.spyOn(userFactory, 'reconstitute').mockResolvedValue(user);
      jest.spyOn(eventPublisher, 'mergeObjectContext').mockReturnValue(user);
      jest.spyOn(userRepository, 'save').mockResolvedValue(user.toEntity());

      const command: UpdateUserCommand = { userId, password };
      const result: UpdateUserCommandResult = {};

      await expect(updateUserCommandHandler.execute(command)).resolves.toEqual(result);
    });
  });
});
