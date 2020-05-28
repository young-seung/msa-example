import { AggregateRoot } from '@nestjs/cqrs';
import uuid from 'uuid';
import UserUpdatedEvent from '../event/updated';
import UserDeletedEvent from '../event/deleted';
import UserEntity from '../entity/user';
// import UserEntity from '../entity/user';

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
    this.apply(new UserUpdatedEvent(uuid.v1(), this.id));
  }

  public delete(): void {
    this.apply(new UserDeletedEvent('deleted', this.id));
  }

  public toEntity(): UserEntity {
    return new UserEntity(this.id);
  }
}
