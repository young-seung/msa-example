import { EntityRepository, getRepository, FindManyOptions } from 'typeorm';

import UserEntity from '@src/users/entity/user';

@EntityRepository(UserEntity)
export default class UserRepository {
  public save = async (data: UserEntity[] | UserEntity): Promise<UserEntity[] | UserEntity> => {
    const entityList = Array.isArray(data) ? data : [data];
    return getRepository(UserEntity).save(entityList);
  };

  public findOne = async (id: string): Promise<UserEntity | undefined> => {
    const repository = getRepository(UserEntity);
    return repository.findOne(id);
  };

  public find = async (options: FindManyOptions): Promise<UserEntity[]> => {
    const repository = getRepository(UserEntity);
    return repository.find(options);
  };
}
