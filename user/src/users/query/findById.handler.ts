import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { NotFoundException, Inject } from '@nestjs/common';

import FindUserByIdQuery from '@src/users/query/findById';
import FindUserByIdQueryResult from '@src/users/query/findById.result';
import UserRepository from '@src/users/repository/user.repository';
import ProfileService from '@src/users/service/profile';

@QueryHandler(FindUserByIdQuery)
export default class FindUserByIdQueryHandler implements IQueryHandler<FindUserByIdQuery> {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
    @Inject(ProfileService) private readonly profileService: ProfileService,
  ) {}

  public async execute(query: FindUserByIdQuery): Promise<FindUserByIdQueryResult> {
    const { userId } = query;
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException();

    const [profile] = await this.profileService.findByUserIds([userId]);
    const name = profile?.name ? profile.name : '';

    return { ...user, name };
  }
}
