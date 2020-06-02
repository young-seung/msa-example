import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';

import CreateUserCommand from '@src/users/command/create';
import CreateUserCommandResult from '@src/users/command/create.result';
import UserEntity from '@src/users/entity/user';
import UserFactory from '@src/users/model/user.factory';

@CommandHandler(CreateUserCommand)
export default class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject(UserFactory) private readonly userFactory: UserFactory,
    @Inject(EventPublisher) private readonly eventPublisher: EventPublisher,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async execute(command: CreateUserCommand): Promise<CreateUserCommandResult> {
    const { email, password } = command;
    const user = this.userFactory.create(email, password);
    this.eventPublisher.mergeObjectContext(user).commit();
    await this.userRepository.save(user.toEntity());
    return new CreateUserCommandResult();
  }
}
