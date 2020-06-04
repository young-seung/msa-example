import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository, FindManyOptions, LessThan, LessThanOrEqual,
} from 'typeorm';

import UserEntity from '@src/users/entity/user';

import FindUserQuery from '@src/users/query/find';
import FindUserQueryResult from '@src/users/query/find.result';

@QueryHandler(FindUserQuery)
export default class FindUserQueryHandler implements IQueryHandler<FindUserQuery> {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async execute(query: FindUserQuery): Promise<FindUserQueryResult> {
    const { cursorId, take } = query;

    const findManyOptions: FindManyOptions = {
      take: take + 1,
      order: { id: 'DESC', createdAt: 'DESC' },
    };

    const cursor = await this.userRepository.findOne(cursorId);
    if (cursorId && cursor) {
      findManyOptions.where = {
        id: LessThan(cursorId),
        createdAt: LessThanOrEqual(cursor.createdAt),
      };
    }

    const data = await this.userRepository.find(findManyOptions);

    return { data, hasMore: data.length === take + 1 };
  }
}
