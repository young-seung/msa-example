import FindUserByIdQueryResult from '@src/users/query/findById.result';

export default interface FindUserQueryResult {
  data: Array<FindUserByIdQueryResult>;
  hasMore: boolean;
}
