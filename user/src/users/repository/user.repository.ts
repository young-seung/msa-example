import {
  EntityRepository,
  getRepository,
  FindManyOptions,
  LessThan,
  LessThanOrEqual,
} from 'typeorm';

import UserEntity from '@src/users/entity/user';

@EntityRepository(UserEntity)
export default class UserRepository {
  public save = async (data: UserEntity[] | UserEntity): Promise<UserEntity[] | UserEntity> => {
    const entityList = Array.isArray(data) ? data : [data];
    return getRepository(UserEntity).save(entityList);
  };

  public findById = async (userId: string): Promise<UserEntity | undefined> => {
    const repository = getRepository(UserEntity);
    return repository.findOne(userId);
  };

  public find = async (cursorId: string, take: number): Promise<UserEntity[]> => {
    const repository = getRepository(UserEntity);
    const findManyOptions: FindManyOptions<UserEntity> = {
      take: take + 1,
      order: { id: 'DESC', createdAt: 'DESC' },
    };

    const cursor = await repository.findOne(cursorId);
    if (cursorId && cursor) {
      const condition = { id: LessThan(cursorId), createdAt: LessThanOrEqual(cursor.createdAt) };
      findManyOptions.where = condition;
    }

    return repository.find(findManyOptions);
  };
}
