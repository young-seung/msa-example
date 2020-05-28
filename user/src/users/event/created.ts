import { IEvent } from '@nestjs/cqrs';

export default class UserCreatedEvent implements IEvent {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly email: string,
    public readonly password: string,
    public readonly type: string = 'created',
  ) {}
}
