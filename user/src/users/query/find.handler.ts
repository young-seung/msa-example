import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import FindUserQuery from './find';
import User from '../entity/user';
import FindUserQueryResult from './find.result';

@QueryHandler(FindUserQuery)
export default class FindUserQueryHandler implements IQueryHandler<FindUserQuery> {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  public async execute(query: FindUserQuery): Promise<FindUserQueryResult> {
    const { take } = query;
    await this.userRepository.find({ take });
    return new FindUserQueryResult();
  }
}
