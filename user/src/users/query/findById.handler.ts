import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import UserEntity from '@src/users/entity/user';

import FindUserByIdQuery from '@src/users/query/findById';
import FindUserByIdQueryResult from '@src/users/query/findById.result';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(FindUserByIdQuery)
export default class FindUserByIdQueryHandler implements IQueryHandler<FindUserByIdQuery> {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async execute(query: FindUserByIdQuery): Promise<FindUserByIdQueryResult> {
    const { userId } = query;
    const user = await this.userRepository.findOne(userId);
    if (!user) throw new NotFoundException();

    return user;
  }
}
