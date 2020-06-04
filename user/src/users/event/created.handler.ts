import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';

import EventEntity from '@src/users/entity/event';
import UserCreatedEvent from '@src/users/event/created';
import Producer from '@src/users/rabbitmq/producer';
import Message from '@src/users/rabbitmq/message';

@EventsHandler(UserCreatedEvent)
export default class UserCreatedEventHandler implements IEventHandler<UserCreatedEvent> {
  constructor(
    @InjectRepository(EventEntity) private readonly eventRepository: Repository<EventEntity>,
    @Inject(Producer) private readonly messageProducer: Producer,
  ) {}

  public async handle(event: UserCreatedEvent): Promise<void> {
    const { id, userId, email, password, fileId, type } = event;
    const eventEntity = new EventEntity(id, userId, email, password, fileId, type);
    const message = new Message(userId, email, password, fileId, type);
    this.messageProducer.sendToQueue(message);
    await this.eventRepository.save(eventEntity);
  }
}
