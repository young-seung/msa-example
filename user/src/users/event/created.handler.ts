import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import EventEntity from '@src/users/entity/event';
import UserCreatedEvent from '@src/users/event/created';
import Publisher from '@src/users/rabbitmq/publisher';
import Message from '@src/users/rabbitmq/message';
import EventRepository from '@src/users/repository/event.repository';

@EventsHandler(UserCreatedEvent)
export default class UserCreatedEventHandler implements IEventHandler<UserCreatedEvent> {
  private readonly key = 'user.created';

  constructor(
    @Inject(EventRepository) private readonly eventRepository: EventRepository,
    @Inject(Publisher) private readonly messagePublisher: Publisher,
  ) {}

  public async handle(event: UserCreatedEvent): Promise<void> {
    const { id, userId, email, password, name, fileId, type } = event;
    const eventEntity = new EventEntity(id, userId, email, password, fileId, type);
    const message = new Message(this.key, userId, email, password, name, fileId, type);
    this.messagePublisher.publish(message);
    await this.eventRepository.save(eventEntity);
  }
}
