import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';

import EventEntity from '@src/users/entity/event';
import UserCreatedEvent from '@src/users/event/created';
import Producer from '@src/users/message/producer';

@EventsHandler(UserCreatedEvent)
export default class UserCreatedEventHandler implements IEventHandler<UserCreatedEvent> {
  constructor(
    @InjectRepository(EventEntity) private readonly eventRepository: Repository<EventEntity>,
    @Inject(Producer) private readonly messageProducer: Producer,
  ) {}

  public async handle(event: UserCreatedEvent): Promise<void> {
    const { id, userId, type } = event;
    const eventEntity = new EventEntity(id, userId, type);
    this.messageProducer.sendToQueue('test');
    await this.eventRepository.save(eventEntity);
  }
}
