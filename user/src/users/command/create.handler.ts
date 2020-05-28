import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import CreateUserCommand from './create';
import CreateUserCommandResult from './create.result';
import User from '../entity/user';
import Producer from '../message/producer';
import UserFactory from '../model/user.factory';

@CommandHandler(CreateUserCommand)
export default class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject(UserFactory) private readonly userFactory: UserFactory,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(Producer) private readonly messageProducer: Producer,
  ) {}

  public async execute(command: CreateUserCommand): Promise<CreateUserCommandResult> {
    const { email, password } = command;
    const user = this.userFactory.create(email, password);
    await this.userRepository.save(user.toEntity());
    return new CreateUserCommandResult();
  }
}
