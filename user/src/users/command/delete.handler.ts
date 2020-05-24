import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import DeleteUserCommand from './delete';
import DeleteUserCommandResult from './delete.result';
import User from '../entity/user';

@CommandHandler(DeleteUserCommand)
export default class DeleteUserCommandHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  public async execute(command: DeleteUserCommand): Promise<DeleteUserCommandResult> {
    const { userId } = command;
    await this.userRepository.softDelete(userId);
    return new DeleteUserCommandResult();
  }
}
