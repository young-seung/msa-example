import { AggregateRoot } from '@nestjs/cqrs';
import UserUpdatedEvent from '../event/updated';
import UserDeletedEvent from '../event/deleted';

export default class User extends AggregateRoot {
  constructor(private readonly id: string) {
    super();
  }

  public update(): void {
    this.apply(new UserUpdatedEvent('updated', this.id));
  }

  public delete(): void {
    this.apply(new UserDeletedEvent('deleted', this.id));
  }
}
