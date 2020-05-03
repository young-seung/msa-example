import { EntityRepository, Repository } from 'typeorm';
import ProfileEntity from '../entity/profile.entity';

@EntityRepository(ProfileEntity)
export default class ProfileRepository extends Repository<ProfileEntity> {}
