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
    private readonly createdAt: Date,
    private updatedAt: Date | null,
    private deletedAt: Date | null,
  ) {
    super();
  }

  public update(email: string, password: string): void {
    this.email = email;
    this.password = password;
    this.updatedAt = new Date();
    const eventId = uuid.v1();
    this.apply(
      new UserUpdatedEvent(
        eventId,
        this.id,
        this.email,
        this.password,
        null,
        this.createdAt,
        this.updatedAt,
        this.deletedAt,
      ),
    );
  }

  public delete(): void {
    this.apply(new UserDeletedEvent('deleted', this.id));
  }

  public toEntity(): UserEntity {
    return new UserEntity(this.id);
  }
}
