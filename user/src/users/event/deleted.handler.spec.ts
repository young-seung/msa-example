import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';

import UserDeletedEventHandler from '@src/users/event/deleted.handler';
import EventEntity from '@src/users/entity/event';
import Publisher from '@src/users/rabbitmq/publisher';
import UserDeletedEvent from '@src/users/event/deleted';
import EventRepository from '@src/users/repository/event.repository';

describe('UserDeletedEventHandler', () => {
  let moduleMetaData: ModuleMetadata;
  let userDeletedEventHandler: UserDeletedEventHandler;
  let eventRepository: EventRepository;
  let messagePublisher: Publisher;

  beforeAll(async () => {
    moduleMetaData = {
      providers: [
        { provide: EventRepository, useClass: Repository },
        Publisher,
        UserDeletedEventHandler,
      ],
    };
    const testModule = await Test.createTestingModule(moduleMetaData).compile();
    userDeletedEventHandler = testModule.get(UserDeletedEventHandler);
    eventRepository = testModule.get(EventRepository);
    messagePublisher = testModule.get(Publisher);
  });

  describe('handle', () => {
    it('should return Promise<void>', async () => {
      const id = 'eventId';
      const userId = 'userId';
      const type = 'user.deleted';
      const email = 'test@email.com';
      const password = 'password';
      const name = 'name';
      const fileId = null;

      const event = new UserDeletedEvent(id, userId, email, password, name, fileId);
      const eventEntity = new EventEntity(id, userId, email, password, fileId, type);

      jest.spyOn(messagePublisher, 'publish').mockReturnValue(undefined);
      jest.spyOn(eventRepository, 'save').mockResolvedValue(eventEntity);

      await expect(userDeletedEventHandler.handle(event)).resolves.toEqual(undefined);
    });
  });
});
