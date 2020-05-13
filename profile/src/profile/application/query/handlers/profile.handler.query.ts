import { QueryHandler, IQueryHandler, EventPublisher } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull } from 'typeorm';
import ReadProfileQuery from '../implemenets/profile.query';
import ProfileEntity from '../../../infrastructure/entity/profile.entity';
import ProfileRepository from '../../../infrastructure/repository/profile.repository';
import ReadProfileMapper from '../../../infrastructure/mapper/profile.mapper.read';
import ProfileRedis from '../../../infrastructure/redis/profile.redis';
import Profile from '../../../domain/model/profile.model';

type Response = { id: string; name: string; email: string };

@QueryHandler(ReadProfileQuery)
export default class ReadProfileQueryHandler implements IQueryHandler<ReadProfileQuery> {
  constructor(
    @InjectRepository(ProfileEntity) private readonly repository: ProfileRepository,
    private readonly publisher: EventPublisher,
  ) {}

  private parseCache(cached: string): Response {
    const data: ProfileEntity = JSON.parse(cached);
    const profile = new Profile(data.id, data.name, data.email);
    this.publisher.mergeObjectContext(profile);
    const { id, name, email } = profile;
    return {
      id,
      name,
      email,
    };
  }

  async execute(query: ReadProfileQuery): Promise<Response | undefined> {
    const redis = new ProfileRedis();
    const cached = await redis.get(`profile:${query.id}`);
    if (cached) return this.parseCache(cached);

    const result = await this.repository.findOne({
      ...new ReadProfileMapper(query.id),
      deletedAt: IsNull(),
    });
    if (!result) return undefined;

    redis.set(`profile:${query.id}`, JSON.stringify(result));

    const profile = new Profile(result.id, result.name, result.email);
    this.publisher.mergeObjectContext(profile);

    const { id, name, email } = profile;
    return {
      id,
      name,
      email,
    };
  }
}
