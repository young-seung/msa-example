import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';

import CreateUserCommand from '@src/users/command/create';
import CreateUserCommandResult from '@src/users/command/create.result';
import UserEntity from '@src/users/entity/user';
import Producer from '@src/users/message/producer';
import UserFactory from '@src/users/model/user.factory';

@CommandHandler(CreateUserCommand)
export default class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject(UserFactory) private readonly userFactory: UserFactory,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @Inject(Producer) private readonly messageProducer: Producer,
  ) {}

  public async execute(command: CreateUserCommand): Promise<CreateUserCommandResult> {
    const { email, password } = command;
    const user = this.userFactory.create(email, password);
    await this.userRepository.save(user.toEntity());
    return new CreateUserCommandResult();
  }
}
