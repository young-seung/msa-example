import FindUserQueryResult from '@src/users/query/find.result';

export default class FindUserResponse {
  constructor(public readonly message: string, public readonly result: FindUserQueryResult) {}
}
