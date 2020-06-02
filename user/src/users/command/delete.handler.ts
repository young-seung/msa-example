import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';

import DeleteUserCommand from '@src/users/command/delete';
import DeleteUserCommandResult from '@src/users/command/delete.result';
import UserEntity from '@src/users/entity/user';
import UserFactory from '@src/users/model/user.factory';

@CommandHandler(DeleteUserCommand)
export default class DeleteUserCommandHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @Inject(EventPublisher) private readonly eventPublisher: EventPublisher,
    @Inject(UserFactory) private readonly userFactory: UserFactory,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async execute(command: DeleteUserCommand): Promise<DeleteUserCommandResult> {
    const { userId } = command;
    const user = await this.userFactory.reconstitute(userId);
    this.eventPublisher.mergeObjectContext(user).delete().commit();
    await this.userRepository.save(user.toEntity());
    return new DeleteUserCommandResult();
  }
}
