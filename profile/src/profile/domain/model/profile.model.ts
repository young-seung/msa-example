import { AggregateRoot } from '@nestjs/cqrs';

export default class Profile extends AggregateRoot {
  constructor(public readonly id: string, public name: string, public readonly email: string) {
    super();
  }

  updateName(newName: string): void {
    this.name = newName;
  }
}
