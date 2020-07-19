import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import EventEntity from '@src/users/entity/event';
import UserDeletedEvent from '@src/users/event/deleted';
import Publisher from '@src/users/rabbitmq/publisher';
import Message from '@src/users/rabbitmq/message';
import EventRepository from '@src/users/repository/event.repository';

@EventsHandler(UserDeletedEvent)
export default class UserDeletedEventHandler implements IEventHandler {
  private readonly key = 'user.deleted';

  constructor(
    @Inject(EventRepository) private readonly eventRepository: EventRepository,
    @Inject(Publisher) private readonly messagePublisher: Publisher,
  ) {}

  public async handle(event: UserDeletedEvent): Promise<void> {
    const { id, userId, type, email, password, name, fileId } = event;
    const eventEntity = new EventEntity(id, userId, email, password, fileId, type);
    const message = new Message(this.key, userId, email, password, name, fileId, type);
    this.messagePublisher.publish(message);
    await this.eventRepository.save(eventEntity);
  }
}
