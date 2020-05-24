export default class UserUpdatedEvent {
  constructor(public readonly type: string, public readonly userId: string) {}
}
