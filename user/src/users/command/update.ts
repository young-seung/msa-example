export default class UpdateUserCommand {
  constructor(public readonly userId: string, public readonly password: string) {}
}
