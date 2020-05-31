import uuid from 'uuid';
import { Injectable } from '@nestjs/common';

import UserCreatedEvent from '@src/users/event/created';
import User from '@src/users/model/user.model';

@Injectable()
export default class UserFactory {
  private readonly updatedAt = null;

  private readonly deletedAt = null;

  public create(email: string, password: string): User {
    const userId = uuid.v1();
    const createdAt = new Date();
    const user = new User(userId, email, password, createdAt, this.updatedAt, this.deletedAt);
    const eventId = uuid.v1();
    user.apply(
      new UserCreatedEvent(
        eventId,
        userId,
        email,
        password,
        null,
        createdAt,
        this.updatedAt,
        this.deletedAt,
      ),
    );
    return user;
  }
}
