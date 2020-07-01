import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import CreateUserCommand from '@src/users/command/create';
import CreateUserCommandResult from '@src/users/command/create.result';
import UserFactory from '@src/users/model/user.factory';
import UserRepository from '@src/users/repository/user.repository';

@CommandHandler(CreateUserCommand)
export default class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject(UserFactory) private readonly userFactory: UserFactory,
    @Inject(EventPublisher) private readonly eventPublisher: EventPublisher,
    @Inject(UserRepository) private readonly userRepository: UserRepository,
  ) {}

  public async execute(command: CreateUserCommand): Promise<CreateUserCommandResult> {
    const { email, password, name } = command;
    const user = this.userFactory.create(email, password, name);
    this.eventPublisher.mergeObjectContext(user).commit();
    await this.userRepository.save(user.toEntity());
    return new CreateUserCommandResult();
  }
}
