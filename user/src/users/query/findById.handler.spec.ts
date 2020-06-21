import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';

import FindUserByIdQueryHandler from '@src/users/query/findById.handler';
import FindUserByIdQuery from '@src/users/query/findById';
import UserRepository from '@src/users/repository/user.repository';

describe('FindUserByIdQueryHandler', () => {
  let moduleMetaData: ModuleMetadata;
  let userRepository: UserRepository;
  let findUserByIdQueryHandler: FindUserByIdQueryHandler;

  beforeAll(async () => {
    moduleMetaData = {
      providers: [{ provide: UserRepository, useClass: Repository }, FindUserByIdQueryHandler],
    };
    const testModule = await Test.createTestingModule(moduleMetaData).compile();
    userRepository = testModule.get(UserRepository);
    findUserByIdQueryHandler = testModule.get(FindUserByIdQueryHandler);
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

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

    expect(findUserByIdQueryHandler.execute(query)).resolves.toEqual(user);
  });
});
