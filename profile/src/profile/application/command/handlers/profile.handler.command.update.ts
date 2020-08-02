import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { IsNull } from 'typeorm';

import ProfileEntity from '@src/profile/infrastructure/entity/profile.entity';
import ProfileRepository from '@src/profile/infrastructure/repository/profile.repository';
import UpdateProfileMapper from '@src/profile/infrastructure/mapper/profile.mapper.update';

import UpdateProfileCommand from '@src/profile/application/command/implements/profile.command.update';

import Profile from '@src/profile/domain/model/profile.model';

@CommandHandler(UpdateProfileCommand)
export default class UpdateProfileCommandHandler implements ICommandHandler<UpdateProfileCommand> {
  constructor(
    @InjectRepository(ProfileEntity) private readonly repository: ProfileRepository,
    private readonly publisher: EventPublisher,
  ) {}

  public async execute(command: UpdateProfileCommand): Promise<void> {
    const data = await this.repository
      .findOneOrFail({ id: command.id, deletedAt: IsNull() })
      .catch(() => {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      });
    const profile = this.publisher.mergeObjectContext(new Profile(data.id, data.name, data.email));
    profile.updateName(command.newName);
    profile.commit();
    await this.repository.update({ id: profile.id }, new UpdateProfileMapper(profile));
  }
}
