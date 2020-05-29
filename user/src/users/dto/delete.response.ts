import DeleteUserCommandResult from '@src/users/command/delete.result';

export default class DeleteUserResponse {
  constructor(public readonly message: string, public readonly result: DeleteUserCommandResult) {}
}
