import uuid from 'uuid';
import { Injectable, Inject, NotFoundException } from '@nestjs/common';

import UserCreatedEvent from '@src/users/event/created';
import User from '@src/users/model/user';
import AccountService from '@src/users/service/account';
import UserRepository from '@src/users/repository/user.repository';

@Injectable()
export default class UserFactory {
  private readonly updatedAt = null;

  private readonly deletedAt = null;

  constructor(
    @Inject(AccountService) private readonly accountService: AccountService,
    @Inject(UserRepository) private readonly userRepository: UserRepository,
  ) {}

  public create(email: string, password: string): User {
    const userId = uuid.v1();
    const createdAt = new Date();
    const user = new User(userId, email, password, createdAt, this.updatedAt, this.deletedAt);
    const eventId = uuid.v1();
    user.apply(new UserCreatedEvent(eventId, userId, email, password, null));
    return user;
  }

  public async reconstitute(userId: string): Promise<User> {
    const userEntity = await this.userRepository.findById(userId);
    if (!userEntity) throw new NotFoundException('can not found user');

    const accountList = await this.accountService.findByUserIds([userId]);
    const userAccount = accountList.find((account) => account.userId === userId);
    if (!accountList || !userAccount) throw new NotFoundException('user account is not found');

    const { id, createdAt, updatedAt, deletedAt } = userEntity;
    const { email, password } = userAccount;
    return new User(id, email, password, createdAt, updatedAt, deletedAt);
  }
}
