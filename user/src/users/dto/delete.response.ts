import DeleteUserCommandResult from '../command/delete.result';

export default class DeleteUserResponse {
  constructor(public readonly message: string, public readonly result: DeleteUserCommandResult) {}
}
