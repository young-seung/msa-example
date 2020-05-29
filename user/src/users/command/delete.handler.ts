import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import DeleteUserCommand from '@src/users/command/delete';
import DeleteUserCommandResult from '@src/users/command/delete.result';
import User from '@src/users/entity/user';

@CommandHandler(DeleteUserCommand)
export default class DeleteUserCommandHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  public async execute(command: DeleteUserCommand): Promise<DeleteUserCommandResult> {
    const { userId } = command;
    await this.userRepository.softDelete(userId);
    return new DeleteUserCommandResult();
  }
}
