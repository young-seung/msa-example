import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';

import Event from '@src/users/entity/event';
import UserDeletedEvent from '@src/users/event/deleted';
import Producer from '@src/users/message/producer';

@EventsHandler(UserDeletedEvent)
export default class UserDeletedEventHandler implements IEventHandler {
  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    @Inject(Producer) private readonly messageProducer: Producer,
  ) {}

  public handle(event: UserDeletedEvent): Promise<void> {
    this.messageProducer.sendToQueue(`${event}`);
  }
}
