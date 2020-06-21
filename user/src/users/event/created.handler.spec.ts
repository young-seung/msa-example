import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';

import UserCreatedEventHandler from '@src/users/event/created.handler';
import EventEntity from '@src/users/entity/event';
import Publisher from '@src/users/rabbitmq/publisher';
import UserCreatedEvent from '@src/users/event/created';
import EventRepository from '@src/users/repository/event.repository';

describe('UserCreatedEventHandler', () => {
  let moduleMetaData: ModuleMetadata;
  let userCreatedEventHandler: UserCreatedEventHandler;
  let eventRepository: EventRepository;
  let messagePublisher: Publisher;

  beforeAll(async () => {
    moduleMetaData = {
      providers: [
        { provide: EventRepository, useClass: Repository },
        Publisher,
        UserCreatedEventHandler,
      ],
    };
    const testModule = await Test.createTestingModule(moduleMetaData).compile();
    userCreatedEventHandler = testModule.get(UserCreatedEventHandler);
    eventRepository = testModule.get(EventRepository);
    messagePublisher = testModule.get(Publisher);
  });

  describe('handle', () => {
    it('should return Promise<void>', () => {
      const id = 'eventId';
      const userId = 'userId';
      const type = 'user.created';
      const email = 'test@email.com';
      const password = 'password';
      const fileId = null;

      const event = new UserCreatedEvent(id, userId, email, password, fileId);
      const eventEntity = new EventEntity(id, userId, email, password, fileId, type);

      jest.spyOn(messagePublisher, 'publish').mockReturnValue(undefined);
      jest.spyOn(eventRepository, 'save').mockResolvedValue(eventEntity);

      expect(userCreatedEventHandler.handle(event)).resolves.toEqual(undefined);
    });
  });
});
