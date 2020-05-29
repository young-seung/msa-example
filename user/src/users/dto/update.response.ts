import UpdateUserCommandResult from '@src/users/command/update.result';

export default class UpdateUserResponse {
  constructor(public readonly message: string, public readonly result: UpdateUserCommandResult) {}
}
