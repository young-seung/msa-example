import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';

import UserCreatedEventHandler from '@src/users/event/created.handler';
import EventEntity from '@src/users/entity/event';
import Producer from '@src/users/message/producer';
import UserCreatedEvent from '@src/users/event/created';

describe('UserCreatedEventHandler', () => {
  let moduleMetaData: ModuleMetadata;
  let userCreatedEventHandler: UserCreatedEventHandler;
  let eventRepository: Repository<EventEntity>;
  let messageProducer: Producer;

  beforeAll(async () => {
    moduleMetaData = {
      providers: [
        { provide: 'EventEntityRepository', useClass: Repository },
        Producer,
        UserCreatedEventHandler,
      ],
    };
    const testModule = await Test.createTestingModule(moduleMetaData).compile();
    userCreatedEventHandler = testModule.get('UserCreatedEventHandler');
    eventRepository = testModule.get('EventEntityRepository');
    messageProducer = testModule.get('Producer');
  });

  describe('handle', () => {
    it('should return Promise<void>', () => {
      const id = 'eventId';
      const userId = 'userId';
      const type = 'created';
      const email = 'test@email.com';
      const password = 'password';
      const event: UserCreatedEvent = {
        id,
        userId,
        type,
        email,
        password,
      };

      const eventEntity = new EventEntity(id, userId, type);

      jest.spyOn(messageProducer, 'sendToQueue').mockReturnValue(undefined);
      jest.spyOn(eventRepository, 'save').mockResolvedValue(eventEntity);

      expect(userCreatedEventHandler.handle(event)).resolves.toEqual(undefined);
    });
  });
});
