import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';

import EventEntity from '@src/users/entity/event';
import UserCreatedEvent from '@src/users/event/created';
import Publisher from '@src/users/rabbitmq/publisher';
import Message from '@src/users/rabbitmq/message';

@EventsHandler(UserCreatedEvent)
export default class UserCreatedEventHandler implements IEventHandler<UserCreatedEvent> {
  constructor(
    @InjectRepository(EventEntity) private readonly eventRepository: Repository<EventEntity>,
    @Inject(Publisher) private readonly messagePublisher: Publisher,
  ) {}

  public async handle(event: UserCreatedEvent): Promise<void> {
    const {
      id, userId, email, password, fileId, type,
    } = event;
    const eventEntity = new EventEntity(id, userId, email, password, fileId, type);
    const message = new Message(userId, email, password, fileId, type);
    this.messagePublisher.sendToQueue(message);
    await this.eventRepository.save(eventEntity);
  }
}
