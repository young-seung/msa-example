import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import User from '@src/users/entity/user';

import FindUserQuery from '@src/users/query/find';
import FindUserQueryResult from '@src/users/query/find.result';

@QueryHandler(FindUserQuery)
export default class FindUserQueryHandler implements IQueryHandler<FindUserQuery> {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  public async execute(query: FindUserQuery): Promise<FindUserQueryResult> {
    const { take } = query;
    await this.userRepository.find({ take });
    return new FindUserQueryResult();
  }
}
