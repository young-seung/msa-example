import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';

import UserUpdatedEventHandler from '@src/users/event/updated.handler';
import EventEntity from '@src/users/entity/event';
import Publisher from '@src/users/rabbitmq/publisher';
import UserUpdatedEvent from '@src/users/event/updated';

describe('UserUpdatedEventHandler', () => {
  let moduleMetaData: ModuleMetadata;
  let userUpdatedEventHandler: UserUpdatedEventHandler;
  let eventRepository: Repository<EventEntity>;
  let messagePublisher: Publisher;

  beforeAll(async () => {
    moduleMetaData = {
      providers: [
        { provide: 'EventEntityRepository', useClass: Repository },
        Publisher,
        UserUpdatedEventHandler,
      ],
    };
    const testModule = await Test.createTestingModule(moduleMetaData).compile();
    userUpdatedEventHandler = testModule.get('UserUpdatedEventHandler');
    eventRepository = testModule.get('EventEntityRepository');
    messagePublisher = testModule.get('Publisher');
  });

  describe('handle', () => {
    it('should return Promise<void>', () => {
      const id = 'eventId';
      const userId = 'userId';
      const type = 'user.updated';
      const email = 'test@email.com';
      const password = 'password';
      const fileId = null;

      const event = new UserUpdatedEvent(id, userId, email, password, fileId);
      const eventEntity = new EventEntity(id, userId, email, password, fileId, type);

      jest.spyOn(messagePublisher, 'sendToQueue').mockReturnValue(undefined);
      jest.spyOn(eventRepository, 'save').mockResolvedValue(eventEntity);

      expect(userUpdatedEventHandler.handle(event)).resolves.toEqual(undefined);
    });
  });
});
