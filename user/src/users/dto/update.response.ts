import UpdateUserCommandResult from '../command/update.result';

export default class UpdateUserResponse {
  constructor(public readonly message: string, public readonly result: UpdateUserCommandResult) {}
}
