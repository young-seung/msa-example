import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull } from 'typeorm';

import ProfileEntity from '@src/profile/infrastructure/entity/profile.entity';
import ProfileRepository from '@src/profile/infrastructure/repository/profile.repository';
import DeleteProfileMapper from '@src/profile/infrastructure/mapper/profile.mapper.delete';

import DeleteProfileCommand from '@src/profile/application/command/implements/profile.command.delete';

import Profile from '@src/profile/domain/model/profile.model';

@CommandHandler(DeleteProfileCommand)
export default class DeleteProfileCommandHandler implements ICommandHandler<DeleteProfileCommand> {
  constructor(
    @InjectRepository(ProfileEntity) private readonly repository: ProfileRepository,
    private readonly publisher: EventPublisher,
  ) {}

  public async execute(command: DeleteProfileCommand): Promise<void> {
    const data = await this.repository
      .findOneOrFail({ where: { id: command.id, deletedAt: IsNull() } })
      .catch(() => {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      });
    const profile = this.publisher.mergeObjectContext(new Profile(data.id, data.name, data.email));
    profile.commit();
    await this.repository.update({ id: profile.id }, new DeleteProfileMapper(profile));
  }
}
