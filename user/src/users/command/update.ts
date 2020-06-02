import { ICommand } from '@nestjs/cqrs';

export default class UpdateUserCommand implements ICommand {
  constructor(public readonly userId: string, public readonly password: string) {}
}
