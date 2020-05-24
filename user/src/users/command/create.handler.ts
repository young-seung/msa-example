import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import uuid from 'uuid';
import CreateUserCommand from './create';
import CreateUserCommandResult from './create.result';
import User from '../entity/user';

@CommandHandler(CreateUserCommand)
export default class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  public async execute(command: CreateUserCommand): Promise<CreateUserCommandResult> {
    const { email, password } = command;
    const user = new User();
    user.id = uuid.v1();
    user.accountId = uuid.v1();
    user.profileId = uuid.v1();
    user.email = email;
    user.password = password;
    user.createdAt = new Date();
    await this.userRepository.save(user);
    return new CreateUserCommandResult();
  }
}
