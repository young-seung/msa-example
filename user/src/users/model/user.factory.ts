import uuid from 'uuid';
import { EventBus } from '@nestjs/cqrs';
import User from './user.model';
import UserCreatedEvent from '../event/created';

export default class UserFactory {
  constructor(private readonly eventBus: EventBus) {}

  public create(email: string, password: string): User {
    const userId = uuid.v1();
    this.eventBus.publish(new UserCreatedEvent(uuid.v1(), userId, email, password));
    return new User(userId, email, password, new Date(), null, null);
  }
}
