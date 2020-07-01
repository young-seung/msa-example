import { ICommand } from '@nestjs/cqrs';

export default class CreateUserCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly name: string,
  ) {}
}
