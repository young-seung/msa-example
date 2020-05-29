import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import User from '@src/users/entity/user';

import FindUserByIdQuery from '@src/users/query/findById';
import FindUserByIdQueryResult from '@src/users/query/findById.result';

@QueryHandler(FindUserByIdQuery)
export default class FindUserByIdQueryHandler implements IQueryHandler<FindUserByIdQuery> {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  public async execute(query: FindUserByIdQuery): Promise<FindUserByIdQueryResult> {
    const { userId } = query;
    await this.userRepository.findOne(userId);
    return new FindUserByIdQueryResult();
  }
}
