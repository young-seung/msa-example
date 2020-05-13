import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull } from 'typeorm';
import DeleteProfileCommand from '../implements/profile.command.delete';
import ProfileEntity from '../../../infrastructure/entity/profile.entity';
import ProfileRepository from '../../../infrastructure/repository/profile.repository';
import Profile from '../../../domain/model/profile.model';
import DeleteProfileMapper from '../../../infrastructure/mapper/profile.mapper.delete';

@CommandHandler(DeleteProfileCommand)
export default class DeleteProfileCommandHandler implements ICommandHandler<DeleteProfileCommand> {
  constructor(
    @InjectRepository(ProfileEntity) private readonly repository: ProfileRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: DeleteProfileCommand): Promise<void> {
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
