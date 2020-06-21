import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import DeleteUserCommand from '@src/users/command/delete';
import DeleteUserCommandResult from '@src/users/command/delete.result';
import UserFactory from '@src/users/model/user.factory';
import UserRepository from '@src/users/repository/user.repository';

@CommandHandler(DeleteUserCommand)
export default class DeleteUserCommandHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @Inject(EventPublisher) private readonly eventPublisher: EventPublisher,
    @Inject(UserFactory) private readonly userFactory: UserFactory,
    @Inject(UserRepository) private readonly userRepository: UserRepository,
  ) {}

  public async execute(command: DeleteUserCommand): Promise<DeleteUserCommandResult> {
    const { userId } = command;
    const user = await this.userFactory.reconstitute(userId);
    this.eventPublisher.mergeObjectContext(user).delete().commit();
    await this.userRepository.save(user.toEntity());
    return new DeleteUserCommandResult();
  }
}
