import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import UpdateUserCommand from '@src/users/command/update';
import UpdateUserCommandResult from '@src/users/command/update.result';
import User from '@src/users/entity/user';

@CommandHandler(UpdateUserCommand)
export default class UpdateUserCommandHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  public async execute(command: UpdateUserCommand): Promise<UpdateUserCommandResult> {
    const { userId } = command;
    const user = await this.userRepository.findOne(userId);
    if (!user) throw new NotFoundException();

    await this.userRepository.save(user);
    return new UpdateUserCommandResult();
  }
}