import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Repository } from 'typeorm';
import UserEntity from '@src/users/entity/user';
import { Test } from '@nestjs/testing';
import FindUserQueryHandler from '@src/users/query/find.handler';
import FindUserQuery from '@src/users/query/find';
import FindUserQueryResult from '@src/users/query/find.result';
import UserRepository from '@src/users/repository/user.repository';

describe('FindUserQueryHandler', () => {
  let moduleMetaData: ModuleMetadata;
  let userRepository: Repository<UserEntity>;
  let findUserQueryHandler: FindUserQueryHandler;

  beforeAll(async () => {
    moduleMetaData = {
      providers: [{ provide: UserRepository, useClass: Repository }, FindUserQueryHandler],
    };
    const testModule = await Test.createTestingModule(moduleMetaData).compile();
    userRepository = testModule.get(UserRepository);
    findUserQueryHandler = testModule.get(FindUserQueryHandler);
  });

  describe('execute', () => {
    it('should return Promise<FindUserQueryResult>', () => {
      const cursorId = 'cursorId';
      const take = 1;
      const hasMore = false;
      const cursor = {
        id: 'cursorId',
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      };
      const user = {
        id: 'userId',
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      };
      const userList = [user];

      const query: FindUserQuery = { cursorId, take };
      const result: FindUserQueryResult = { hasMore, data: userList };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(cursor);
      jest.spyOn(userRepository, 'find').mockResolvedValue(userList);

      expect(findUserQueryHandler.execute(query)).resolves.toEqual(result);
    });
  });
});
