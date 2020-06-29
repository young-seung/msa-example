import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import FindUserQuery from '@src/users/query/find';
import FindUserQueryResult from '@src/users/query/find.result';
import UserRepository from '@src/users/repository/user.repository';

@QueryHandler(FindUserQuery)
export default class FindUserQueryHandler implements IQueryHandler<FindUserQuery> {
  constructor(@Inject(UserRepository) private readonly userRepository: UserRepository) {}

  public async execute(query: FindUserQuery): Promise<FindUserQueryResult> {
    const { cursorId, take } = query;

    const data = await this.userRepository.find(cursorId, take);

    return { data, hasMore: data.length === take + 1 };
  }
}
