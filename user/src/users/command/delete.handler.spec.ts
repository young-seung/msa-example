import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Repository } from 'typeorm';
import { EventPublisher } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

import DeleteUserCommandHandler from '@src/users/command/delete.handler';
import UserEntity from '@src/users/entity/user';
import UserFactory from '@src/users/model/user.factory';
import User from '@src/users/model/user.model';
import DeleteUserCommand from '@src/users/command/delete';
import DeleteUserCommandResult from '@src/users/command/delete.result';

describe('DeleteUserCommandHandler', () => {
  let moduleMetaData: ModuleMetadata;
  let eventPublisher: EventPublisher;
  let deleteUserCommandHandler: DeleteUserCommandHandler;
  let userFactory: UserFactory;
  let userRepository: Repository<UserEntity>;

  beforeAll(async () => {
    moduleMetaData = {
      providers: [
        { provide: EventPublisher, useValue: { mergeObjectContext: (): null => null } },
        { provide: UserFactory, useValue: { reconstitute: (): null => null } },
        { provide: 'UserEntityRepository', useClass: Repository },
        DeleteUserCommandHandler,
      ],
    };
    const testModule = await Test.createTestingModule(moduleMetaData).compile();
    deleteUserCommandHandler = testModule.get(DeleteUserCommandHandler);
    userFactory = testModule.get(UserFactory);
    userRepository = testModule.get('UserEntityRepository');
    eventPublisher = testModule.get(EventPublisher);
  });

  describe('delete', () => {
    it('should return DeleteUserCommandHandler', () => {
      const userId = 'userId';
      const email = 'test@email.com';
      const password = 'password';
      const createdAt = new Date();
      const updatedAt = null;
      const deletedAt = null;

      const user = new User(userId, email, password, createdAt, updatedAt, deletedAt);
      const userEntity = new UserEntity(userId);

      jest.spyOn(userFactory, 'reconstitute').mockResolvedValue(user);
      jest.spyOn(eventPublisher, 'mergeObjectContext').mockReturnValue(user);
      jest.spyOn(userRepository, 'save').mockResolvedValue(userEntity);

      const command: DeleteUserCommand = { userId };
      const result: DeleteUserCommandResult = {};

      expect(deleteUserCommandHandler.execute(command)).resolves.toEqual(result);
    });
  });
});
