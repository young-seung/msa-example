export default class UserCreatedEvent {
  public readonly type: string = 'user.created';

  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly email: string,
    public readonly password: string,
    public readonly fileId: string | null,
  ) {}
}
