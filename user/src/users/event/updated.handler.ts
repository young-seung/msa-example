import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';

import EventEntity from '@src/users/entity/event';
import UserUpdatedEvent from '@src/users/event/updated';
import Publisher from '@src/users/rabbitmq/publisher';
import Message from '@src/users/rabbitmq/message';

@EventsHandler(UserUpdatedEvent)
export default class UserUpdatedEventHandler implements IEventHandler<UserUpdatedEvent> {
  constructor(
    @InjectRepository(EventEntity) private readonly eventRepository: Repository<EventEntity>,
    @Inject(Publisher) private readonly messagePublisher: Publisher,
  ) {}

  public async handle(event: UserUpdatedEvent): Promise<void> {
    const {
      id, type, userId, email, password, fileId,
    } = event;
    const entity = new EventEntity(id, userId, email, password, fileId, type);
    const message = new Message(userId, email, password, fileId, type);
    this.messagePublisher.sendToQueue(message);
    await this.eventRepository.save(entity);
  }
}
