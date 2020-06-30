import { ModuleMetadata, Provider } from '@nestjs/common/interfaces';
import { Test } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';

import FindUserByIdQueryHandler from '@src/users/query/findById.handler';
import FindUserByIdQuery from '@src/users/query/findById';
import UserRepository from '@src/users/repository/user.repository';
import ProfileService from '@src/users/service/profile';

describe('FindUserByIdQueryHandler', () => {
  let moduleMetaData: ModuleMetadata;
  let userRepository: UserRepository;
  let findUserByIdQueryHandler: FindUserByIdQueryHandler;
  let profileService: ProfileService;

  beforeAll(async () => {
    const httpServiceProvider: Provider = { provide: HttpService, useValue: {} };
    const providers = [
      UserRepository,
      FindUserByIdQueryHandler,
      ProfileService,
      httpServiceProvider,
    ];
    moduleMetaData = { providers };
    const testModule = await Test.createTestingModule(moduleMetaData).compile();

    userRepository = testModule.get(UserRepository);
    findUserByIdQueryHandler = testModule.get(FindUserByIdQueryHandler);
    profileService = testModule.get(ProfileService);
  });

  it('should return Promise<FindUserByIdQueryResult>', () => {
    const userId = 'userId';
    const user = {
      id: userId,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    };
    const query: FindUserByIdQuery = { userId };
    const profile = { userId: 'userId', name: 'name' };

    jest.spyOn(userRepository, 'findById').mockResolvedValue(user);
    jest.spyOn(profileService, 'findByUserIds').mockResolvedValue([profile]);

    expect(findUserByIdQueryHandler.execute(query)).resolves.toEqual({ ...user, name: 'name' });
  });
});
