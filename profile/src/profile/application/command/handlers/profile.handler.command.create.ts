import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

import ProfileEntity from '@src/profile/infrastructure/entity/profile.entity';
import ProfileRepository from '@src/profile/infrastructure/repository/profile.repository';
import CreateProfileMapper from '@src/profile/infrastructure/mapper/profile.mapper.create';

import CreateProfileCommand from '@src/profile/application/command/implements/profile.command.create';

import Profile from '@src/profile/domain/model/profile.model';

@CommandHandler(CreateProfileCommand)
export default class CreateProfileCommandHandler implements ICommandHandler<CreateProfileCommand> {
  constructor(
    @InjectRepository(ProfileEntity) private readonly repository: ProfileRepository,
    private readonly publisher: EventPublisher,
  ) {}

  public async execute(command: CreateProfileCommand): Promise<void> {
    await this.repository.findOne({ where: [{ email: command.email }] }).then((item) => {
      if (item) throw new HttpException('Conflict', HttpStatus.CONFLICT);
    });

    const { name, email } = command;
    const result = await this.repository.save(new CreateProfileMapper(name, email));

    const profile: Profile = this.publisher.mergeObjectContext(new Profile(result.id, name, email));
    profile.commit();
  }
}
