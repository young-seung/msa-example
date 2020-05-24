import CreateUserCommandResult from '../command/create.result';

export default class CreateUserResponse {
  constructor(public readonly message: string, public readonly result: CreateUserCommandResult) {}
}
