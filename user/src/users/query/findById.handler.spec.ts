import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Repository } from 'typeorm';
import UserEntity from '@src/users/entity/user';
import FindUserByIdQueryHandler from '@src/users/query/findById.handler';
import { Test } from '@nestjs/testing';
import FindUserByIdQuery from '@src/users/query/findById';

describe('FindUserByIdQueryHandler', () => {
  let moduleMetaData: ModuleMetadata;
  let userRepository: Repository<UserEntity>;
  let findUserByIdQueryHandler: FindUserByIdQueryHandler;

  beforeAll(async () => {
    moduleMetaData = {
      providers: [
        { provide: 'UserEntityRepository', useClass: Repository },
        FindUserByIdQueryHandler,
      ],
    };
    const testModule = await Test.createTestingModule(moduleMetaData).compile();
    userRepository = testModule.get('UserEntityRepository');
    findUserByIdQueryHandler = testModule.get('FindUserByIdQueryHandler');
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
