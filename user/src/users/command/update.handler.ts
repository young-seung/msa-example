import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import UpdateUserCommand from '@src/users/command/update';
import UpdateUserCommandResult from '@src/users/command/update.result';
import UserFactory from '@src/users/model/user.factory';
import UserRepository from '@src/users/repository/user.repository';

@CommandHandler(UpdateUserCommand)
export default class UpdateUserCommandHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @Inject(EventPublisher) private readonly eventPublisher: EventPublisher,
    @Inject(UserFactory) private readonly userFactory: UserFactory,
    @Inject(UserRepository) private readonly userRepository: UserRepository,
  ) {}

  public async execute(command: UpdateUserCommand): Promise<UpdateUserCommandResult> {
    const { userId, password } = command;
    const user = await this.userFactory.reconstitute(userId);
    this.eventPublisher.mergeObjectContext(user).update(null, password).commit();
    await this.userRepository.save(user.toEntity());
    return new UpdateUserCommandResult();
  }
}
