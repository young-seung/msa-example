import { Repository } from 'typeorm';
import { EventPublisher } from '@nestjs/cqrs';
import { Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ModuleMetadata } from '@nestjs/common/interfaces';

import ProfileEntity from '@src/profile/infrastructure/entity/profile.entity';

import DeleteProfileCommandHandler from '@src/profile/application/command/handlers/profile.handler.command.delete';
import DeleteProfileCommand from '@src/profile/application/command/implements/profile.command.delete';

import Profile from '@src/profile/domain/model/profile.model';

describe('DeleteProfileCommandHandler', () => {
  let commandHandler: DeleteProfileCommandHandler;
  let profileRepository: Repository<ProfileEntity>;
  let eventPublisher: EventPublisher;

  beforeAll(async () => {
    const profileRepositoryProvider: Provider = {
      provide: 'ProfileEntityRepository',
      useValue: {},
    };
    const eventPublisherProvider: Provider = { provide: EventPublisher, useValue: {} };
    const providers: Provider[] = [
      DeleteProfileCommandHandler,
      profileRepositoryProvider,
      eventPublisherProvider,
    ];
    const moduleMetaData: ModuleMetadata = { providers };
    const testModule = await Test.createTestingModule(moduleMetaData).compile();

    commandHandler = testModule.get(DeleteProfileCommandHandler);
    profileRepository = testModule.get('ProfileEntityRepository');
    eventPublisher = testModule.get(EventPublisher);
  });

  describe('execute', () => {
    it('should return Promise<void>', async () => {
      const id = 'id';
      const name = 'name';
      const email = 'test@email.com';
      const command: DeleteProfileCommand = { id };
      const profileData = { id, name, email };
      const profile = new Profile(id, name, email);

      profileRepository.findOneOrFail = jest.fn().mockResolvedValue(profileData);
      profileRepository.update = jest.fn().mockResolvedValue(profileData);
      eventPublisher.mergeObjectContext = jest.fn().mockReturnValue(profile);

      await expect(commandHandler.execute(command)).resolves.toEqual(undefined);
    });
  });
});
