import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';

import UpdateUserCommand from '@src/users/command/update';
import UpdateUserCommandResult from '@src/users/command/update.result';
import User from '@src/users/entity/user';
import UserFactory from '@src/users/model/user.factory';

@CommandHandler(UpdateUserCommand)
export default class UpdateUserCommandHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @Inject(EventPublisher) private readonly eventPublisher: EventPublisher,
    @Inject(UserFactory) private readonly userFactory: UserFactory,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async execute(command: UpdateUserCommand): Promise<UpdateUserCommandResult> {
    const { userId, password } = command;
    const user = await this.userFactory.reconstitute(userId);
    this.eventPublisher.mergeObjectContext(user).update(null, password).commit();
    await this.userRepository.save(user.toEntity());
    return new UpdateUserCommandResult();
  }
}
