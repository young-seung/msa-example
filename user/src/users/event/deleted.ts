import { IEvent } from '@nestjs/cqrs';
import UserEvent from '@src/users/event/event';

export default class UserDeletedEvent implements IEvent, UserEvent {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly email: string,
    public readonly password: string,
    public readonly fileId: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date | null,
    public readonly deletedAt: Date | null,
    public readonly type: string = 'deleted',
  ) {}
}
