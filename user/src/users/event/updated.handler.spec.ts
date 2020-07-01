import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';

import UserUpdatedEventHandler from '@src/users/event/updated.handler';
import EventEntity from '@src/users/entity/event';
import Publisher from '@src/users/rabbitmq/publisher';
import UserUpdatedEvent from '@src/users/event/updated';
import EventRepository from '@src/users/repository/event.repository';

describe('UserUpdatedEventHandler', () => {
  let moduleMetaData: ModuleMetadata;
  let userUpdatedEventHandler: UserUpdatedEventHandler;
  let eventRepository: EventRepository;
  let messagePublisher: Publisher;

  beforeAll(async () => {
    moduleMetaData = {
      providers: [
        { provide: EventRepository, useClass: Repository },
        Publisher,
        UserUpdatedEventHandler,
      ],
    };
    const testModule = await Test.createTestingModule(moduleMetaData).compile();
    userUpdatedEventHandler = testModule.get(UserUpdatedEventHandler);
    eventRepository = testModule.get(EventRepository);
    messagePublisher = testModule.get(Publisher);
  });

  describe('handle', () => {
    it('should return Promise<void>', async () => {
      const id = 'eventId';
      const userId = 'userId';
      const type = 'user.updated';
      const email = 'test@email.com';
      const password = 'password';
      const name = 'name';
      const fileId = null;

      const event = new UserUpdatedEvent(id, userId, email, password, name, fileId);
      const eventEntity = new EventEntity(id, userId, email, password, fileId, type);

      jest.spyOn(messagePublisher, 'publish').mockReturnValue(undefined);
      jest.spyOn(eventRepository, 'save').mockResolvedValue(eventEntity);

      await expect(userUpdatedEventHandler.handle(event)).resolves.toEqual(undefined);
    });
  });
});
