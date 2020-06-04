import FindUserByIdQueryResult from '@src/users/query/findById.result';

type UserList = Array<FindUserByIdQueryResult>;

export default interface FindUserQueryResult {
  data: UserList;
  hasMore: boolean;
}
