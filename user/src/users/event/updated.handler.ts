import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';

import EventEntity from '@src/users/entity/event';
import UserUpdatedEvent from '@src/users/event/updated';
import Producer from '@src/users/message/producer';
import Message from '@src/users/message/message';

@EventsHandler(UserUpdatedEvent)
export default class UserUpdatedEventHandler implements IEventHandler<UserUpdatedEvent> {
  constructor(
    @InjectRepository(EventEntity) private readonly eventRepository: Repository<EventEntity>,
    @Inject(Producer) private readonly messageProducer: Producer,
  ) {}

  public async handle(event: UserUpdatedEvent): Promise<void> {
    const { id, type, userId } = event;
    const entity = new EventEntity(id, userId, type);
    const message = new Message(event);
    this.messageProducer.sendToQueue(message);
    await this.eventRepository.save(entity);
  }
}
