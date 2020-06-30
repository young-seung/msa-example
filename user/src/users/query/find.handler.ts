import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import FindUserQuery from '@src/users/query/find';
import FindUserQueryResult from '@src/users/query/find.result';
import UserRepository from '@src/users/repository/user.repository';
import ProfileService from '@src/users/service/profile';

@QueryHandler(FindUserQuery)
export default class FindUserQueryHandler implements IQueryHandler<FindUserQuery> {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
    @Inject(ProfileService) private readonly profileService: ProfileService,
  ) {}

  public async execute(query: FindUserQuery): Promise<FindUserQueryResult> {
    const { cursorId, take } = query;

    const users = await this.userRepository.find(cursorId, take);
    const userIds = users.map((user) => user.id);

    const profiles = await this.profileService.findByUserIds(userIds);
    const userProfiles = users.map(({ id }) => profiles.find(({ userId }) => id === userId));
    const userNames = userProfiles.map((userProfile) => (userProfile?.name ? userProfile.name : ''));

    const data = users.map((user, index) => ({ ...user, name: userNames[index] }));
    return { data, hasMore: data.length === take + 1 };
  }
}
