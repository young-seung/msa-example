export default class UserUpdatedEvent {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly type: string = 'updated',
  ) {}
}
