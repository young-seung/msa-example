export default class UserUpdatedEvent {
  public readonly type: string = 'updated';

  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly email: string,
    public readonly password: string,
    public readonly fileId: string | null,
  ) {}
}
