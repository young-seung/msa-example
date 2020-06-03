import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';

import EventEntity from '@src/users/entity/event';
import UserDeletedEvent from '@src/users/event/deleted';
import Producer from '@src/users/rabbitmq/producer';
import Message from '@src/users/rabbitmq/message';

@EventsHandler(UserDeletedEvent)
export default class UserDeletedEventHandler implements IEventHandler {
  constructor(
    @InjectRepository(EventEntity) private readonly eventRepository: Repository<EventEntity>,
    @Inject(Producer) private readonly messageProducer: Producer,
  ) {}

  public async handle(event: UserDeletedEvent): Promise<void> {
    const {
      id, userId, type, email, password, fileId,
    } = event;
    const eventEntity = new EventEntity(id, userId, email, password, fileId, type);
    const message = new Message(event);
    this.messageProducer.sendToQueue(message);
    await this.eventRepository.save(eventEntity);
  }
}
