export default class CreateUserCommand {
  constructor(public readonly email: string, public readonly password: string) {}
}
