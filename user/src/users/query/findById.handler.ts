import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { NotFoundException, Inject } from '@nestjs/common';

import FindUserByIdQuery from '@src/users/query/findById';
import FindUserByIdQueryResult from '@src/users/query/findById.result';
import UserRepository from '@src/users/repository/user.repository';

@QueryHandler(FindUserByIdQuery)
export default class FindUserByIdQueryHandler implements IQueryHandler<FindUserByIdQuery> {
  constructor(@Inject(UserRepository) private readonly userRepository: UserRepository) {}

  public async execute(query: FindUserByIdQuery): Promise<FindUserByIdQueryResult> {
    const { userId } = query;
    const user = await this.userRepository.findOne(userId);
    if (!user) throw new NotFoundException();

    return user;
  }
}
