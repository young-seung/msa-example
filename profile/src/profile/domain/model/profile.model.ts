import { AggregateRoot } from '@nestjs/cqrs';

export default class Profile extends AggregateRoot {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
  ) {
    super();
  }
}
