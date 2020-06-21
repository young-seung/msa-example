import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { FindManyOptions, LessThan, LessThanOrEqual } from 'typeorm';
import { Inject } from '@nestjs/common';

import FindUserQuery from '@src/users/query/find';
import FindUserQueryResult from '@src/users/query/find.result';
import UserRepository from '@src/users/repository/user.repository';

@QueryHandler(FindUserQuery)
export default class FindUserQueryHandler implements IQueryHandler<FindUserQuery> {
  constructor(@Inject(UserRepository) private readonly userRepository: UserRepository) {}

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
