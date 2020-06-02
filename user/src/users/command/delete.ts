import { ICommand } from '@nestjs/cqrs';

export default class DeleteUserCommand implements ICommand {
  constructor(public readonly userId: string) {}
}
