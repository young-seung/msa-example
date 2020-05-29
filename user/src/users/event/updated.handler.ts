import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';

import Event from '@src/users/entity/event';
import UserUpdatedEvent from '@src/users/event/updated';
import Producer from '@src/users/message/producer';

@EventsHandler(UserUpdatedEvent)
export default class UserUpdatedEventHandler implements IEventHandler<UserUpdatedEvent> {
  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    @Inject(Producer) private readonly messageProducer: Producer,
  ) {}

  public async handle(event: UserUpdatedEvent): Promise<void> {
    const { id, type, userId } = event;
    const entity = new Event(id, userId, type);
    this.messageProducer.sendToQueue('test');
    await this.eventRepository.save(entity);
  }
}
