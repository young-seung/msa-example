import { EntityRepository, getRepository } from 'typeorm';

import EventEntity from '@src/users/entity/event';

@EntityRepository(EventEntity)
export default class EventRepository {
  public save = async (data: EventEntity | EventEntity[]): Promise<EventEntity | EventEntity[]> => {
    const entityList = Array.isArray(data) ? data : [data];
    return getRepository(EventEntity).save(entityList);
  };
}
