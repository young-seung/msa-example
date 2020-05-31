import UserEvent from '@src/users/event/event';
import { IEvent } from '@nestjs/cqrs';

export default class UserUpdatedEvent implements UserEvent, IEvent {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly email: string,
    public readonly password: string,
    public readonly fileId: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date | null,
    public readonly deletedAt: Date | null,
    public readonly type: string = 'updated',
  ) {}
}
