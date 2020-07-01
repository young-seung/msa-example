export default class UserDeletedEvent {
  public readonly type: string = 'user.deleted';

  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly email: string,
    public readonly password: string,
    public readonly name: string,
    public readonly fileId: string | null,
  ) {}
}
