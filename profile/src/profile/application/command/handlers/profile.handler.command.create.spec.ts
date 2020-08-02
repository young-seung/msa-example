import { Provider } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { EventPublisher } from '@nestjs/cqrs';
import { ModuleMetadata } from '@nestjs/common/interfaces';

import ProfileEntity from '@src/profile/infrastructure/entity/profile.entity';

import CreateProfileCommand from '@src/profile/application/command/implements/profile.command.create';
import CreateProfileCommandHandler from '@src/profile/application/command/handlers/profile.handler.command.create';

import Profile from '@src/profile/domain/model/profile.model';

describe('CreateProfileCommandHandler', () => {
  let profileRepository: Repository<ProfileEntity>;
  let eventPublisher: EventPublisher;
  let commandHandler: CreateProfileCommandHandler;

  beforeAll(async () => {
    const profileRepositoryProvider = { provide: 'ProfileEntityRepository', useValue: {} };
    const eventPublisherProvider = { provide: EventPublisher, useValue: {} };
    const providers: Provider[] = [
      CreateProfileCommandHandler,
      profileRepositoryProvider,
      eventPublisherProvider,
    ];
    const moduleMetaData: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetaData).compile();

    profileRepository = testModule.get('ProfileEntityRepository');
    eventPublisher = testModule.get(EventPublisher);
    commandHandler = testModule.get(CreateProfileCommandHandler);
  });

  describe('execute', () => {
    it('should return Promise<void>', async () => {
      const email = 'test@email.com';
      const name = 'name';
      const command: CreateProfileCommand = { email, name };
      const profile = new Profile('id', name, email);

      profileRepository.findOne = jest.fn().mockResolvedValue(undefined);
      profileRepository.save = jest.fn().mockResolvedValue({} as ProfileEntity);
      eventPublisher.mergeObjectContext = jest.fn().mockReturnValue(profile);

      await expect(commandHandler.execute(command)).resolves.toEqual(undefined);
    });
  });
});
