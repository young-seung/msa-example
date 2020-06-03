export default class Message {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly password: string,
    public readonly fileId: string | null,
    public readonly type: string,
  ) {}
}
