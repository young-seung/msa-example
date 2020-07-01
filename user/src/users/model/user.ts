import { AggregateRoot } from '@nestjs/cqrs';
import uuid from 'uuid';

import UserUpdatedEvent from '@src/users/event/updated';
import UserDeletedEvent from '@src/users/event/deleted';
import UserEntity from '@src/users/entity/user';

export default class User extends AggregateRoot {
  constructor(
    private readonly id: string,
    private email: string,
    private password: string,
    private name: string,
    private readonly createdAt: Date,
    private updatedAt: Date | null,
    private deletedAt: Date | null,
  ) {
    super();
  }

  public update(email: string | null, password: string | null): User {
    this.email = email || this.email;
    this.password = password || this.password;
    this.updatedAt = new Date();
    const eventId = uuid.v1();
    this.apply(new UserUpdatedEvent(eventId, this.id, this.email, this.password, null));
    return this;
  }

  public delete(): User {
    const eventId = uuid.v1();
    this.deletedAt = new Date();
    this.apply(new UserDeletedEvent(eventId, this.id, this.email, this.password, null));
    return this;
  }

  public toEntity(): UserEntity {
    return new UserEntity(this.id);
  }
}
