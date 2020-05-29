import FindUserByIdQueryResult from '@src/users/query/findById.result';

export default class FindUserByIdResponse {
  constructor(public readonly message: string, public readonly result: FindUserByIdQueryResult) {}
}
