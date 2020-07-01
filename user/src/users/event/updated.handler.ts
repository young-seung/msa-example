import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import EventEntity from '@src/users/entity/event';
import UserUpdatedEvent from '@src/users/event/updated';
import Publisher from '@src/users/rabbitmq/publisher';
import Message from '@src/users/rabbitmq/message';
import EventRepository from '@src/users/repository/event.repository';

@EventsHandler(UserUpdatedEvent)
export default class UserUpdatedEventHandler implements IEventHandler<UserUpdatedEvent> {
  private readonly key = 'user.updated';

  constructor(
    @Inject(EventRepository) private readonly eventRepository: EventRepository,
    @Inject(Publisher) private readonly messagePublisher: Publisher,
  ) {}

  public async handle(event: UserUpdatedEvent): Promise<void> {
    const { id, type, userId, email, password, name, fileId } = event;
    const entity = new EventEntity(id, userId, email, password, fileId, type);
    const message = new Message(this.key, userId, email, password, name, fileId, type);
    this.messagePublisher.publish(message);
    await this.eventRepository.save(entity);
  }
}
