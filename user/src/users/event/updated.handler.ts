import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import uuid from 'uuid';
import Event from '../entity/event';
import UserUpdatedEvent from './updated';

@EventsHandler(UserUpdatedEvent)
export default class UserUpdatedEventHandler implements IEventHandler<UserUpdatedEvent> {
  constructor(@InjectRepository(Event) private readonly eventRepository: Repository<Event>) {}

  public async handle(event: UserUpdatedEvent): Promise<void> {
    const { type, userId } = event;
    const entity = new Event();
    entity.id = uuid.v1();
    entity.userId = userId;
    entity.type = type;
    entity.createdAt = new Date();
    await this.eventRepository.save(entity);
  }
}
