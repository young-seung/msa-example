import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Test } from '@nestjs/testing';

import FindUserQueryHandler from '@src/users/query/find.handler';
import FindUserQuery from '@src/users/query/find';
import FindUserQueryResult from '@src/users/query/find.result';
import UserRepository from '@src/users/repository/user.repository';

describe('FindUserQueryHandler', () => {
  let moduleMetaData: ModuleMetadata;
  let userRepository: UserRepository;
  let findUserQueryHandler: FindUserQueryHandler;

  beforeAll(async () => {
    moduleMetaData = {
      providers: [UserRepository, FindUserQueryHandler],
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
      const user = {
        id: 'userId',
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      };
      const userList = [user];

      const query: FindUserQuery = { cursorId, take };
      const result: FindUserQueryResult = { hasMore, data: userList };

      jest.spyOn(userRepository, 'find').mockResolvedValue(userList);

      expect(findUserQueryHandler.execute(query)).resolves.toEqual(result);
    });
  });
});
