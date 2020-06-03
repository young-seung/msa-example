import uuid from 'uuid';
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import UserCreatedEvent from '@src/users/event/created';
import User from '@src/users/model/user';
import UserEntity from '@src/users/entity/user';
import AccountService from '@src/users/service/account';

@Injectable()
export default class UserFactory {
  private readonly updatedAt = null;

  private readonly deletedAt = null;

  constructor(
    @Inject(AccountService) private readonly accountService: AccountService,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
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
    const userEntity = await this.userRepository.findOneOrFail(userId);
    const accountList = await this.accountService.findByUserId(userId);
    const userAccount = accountList.find((account) => account.userId === userId);
    if (!accountList || !userAccount) throw new NotFoundException('user account is not found');

    const {
      id, createdAt, updatedAt, deletedAt,
    } = userEntity;
    const { email, password } = userAccount;
    return new User(id, email, password, createdAt, updatedAt, deletedAt);
  }
}
