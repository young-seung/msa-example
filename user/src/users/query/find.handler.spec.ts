import { ModuleMetadata, Provider } from '@nestjs/common/interfaces';
import { Test } from '@nestjs/testing';

import FindUserQueryHandler from '@src/users/query/find.handler';
import FindUserQuery from '@src/users/query/find';
import FindUserQueryResult from '@src/users/query/find.result';
import UserRepository from '@src/users/repository/user.repository';
import ProfileService from '@src/users/service/profile';
import { HttpService } from '@nestjs/common';

describe('FindUserQueryHandler', () => {
  let moduleMetaData: ModuleMetadata;
  let userRepository: UserRepository;
  let findUserQueryHandler: FindUserQueryHandler;
  let profileService: ProfileService;

  beforeAll(async () => {
    const httpServiceProvider: Provider = { provide: HttpService, useValue: {} };
    const providers: Provider[] = [
      UserRepository,
      FindUserQueryHandler,
      ProfileService,
      httpServiceProvider,
    ];
    moduleMetaData = { providers };
    const testModule = await Test.createTestingModule(moduleMetaData).compile();

    userRepository = testModule.get(UserRepository);
    findUserQueryHandler = testModule.get(FindUserQueryHandler);
    profileService = testModule.get(ProfileService);
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

      const profile = { userId: 'userId', name: 'name' };

      const query: FindUserQuery = { cursorId, take };
      const result: FindUserQueryResult = { hasMore, data: [{ ...user, name: 'name' }] };

      jest.spyOn(userRepository, 'find').mockResolvedValue([user]);
      jest.spyOn(profileService, 'findByUserIds').mockResolvedValue([profile]);

      expect(findUserQueryHandler.execute(query)).resolves.toEqual(result);
    });
  });
});
