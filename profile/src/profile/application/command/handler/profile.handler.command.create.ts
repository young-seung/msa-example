import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import CreateProfileCommand from '../implements/profile.command.create';
import ProfileEntity from '../../../infrastructure/entity/profile.entity';
import ProfileRepository from '../../../infrastructure/repository/profile.repository';
import CreateProfileMapper from '../../../infrastructure/mapper/profile.mapper.create';
import Profile from '../../../domain/model/profile.model';

@CommandHandler(CreateProfileCommand)
export default class CreateProfileCommandHandler implements ICommandHandler<CreateProfileCommand> {
  constructor(
    @InjectRepository(ProfileEntity) private readonly repository: ProfileRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateProfileCommand): Promise<void> {
    await this.repository.findOne({ where: [{ email: command.email }] }).then((item) => {
      if (item) throw new HttpException('Conflict', HttpStatus.CONFLICT);
    });

    const { name, email } = command;
    const result = await this.repository.save(new CreateProfileMapper(name, email));

    const profile: Profile = this.publisher.mergeObjectContext(new Profile(result.id, name, email));
    profile.commit();
  }
}
