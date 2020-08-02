import { Repository } from 'typeorm';
import { EventPublisher } from '@nestjs/cqrs';
import { Provider } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Test } from '@nestjs/testing';

import ProfileEntity from '@src/profile/infrastructure/entity/profile.entity';

import UpdateProfileCommandHandler from '@src/profile/application/command/handlers/profile.handler.command.update';
import UpdateProfileCommand from '@src/profile/application/command/implements/profile.command.update';

import Profile from '@src/profile/domain/model/profile.model';

describe('UpdateProfileCommandHandler', () => {
  let commandHandler: UpdateProfileCommandHandler;
  let profileRepository: Repository<ProfileEntity>;
  let eventPublisher: EventPublisher;

  beforeAll(async () => {
    const profileRepositoryProvider: Provider = {
      provide: 'ProfileEntityRepository',
      useValue: {},
    };
    const eventPublisherProvider: Provider = { provide: EventPublisher, useValue: {} };
    const providers: Provider[] = [
      UpdateProfileCommandHandler,
      profileRepositoryProvider,
      eventPublisherProvider,
    ];
    const moduleMetaData: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetaData).compile();

    commandHandler = testModule.get(UpdateProfileCommandHandler);
    profileRepository = testModule.get('ProfileEntityRepository');
    eventPublisher = testModule.get(EventPublisher);
  });

  describe('execute', () => {
    it('should return Promise<void>', async () => {
      const id = 'id';
      const newName = 'new name';
      const email = 'test@email.com';
      const name = 'name';
      const command: UpdateProfileCommand = { id, newName };
      const profileData = { id, name, email };
      const profile = new Profile(id, name, email);

      profileRepository.findOneOrFail = jest.fn().mockResolvedValue(profileData);
      eventPublisher.mergeObjectContext = jest.fn().mockReturnValueOnce(profile);
      profileRepository.update = jest.fn().mockResolvedValue(profile);

      await expect(commandHandler.execute(command)).resolves.toEqual(undefined);
    });
  });
});
