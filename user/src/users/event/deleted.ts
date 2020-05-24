export default class UserDeletedEvent {
  constructor(public readonly type: string, public readonly userId: string) {}
}
