export default class Message {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly email: string,
    public readonly password: string,
    public readonly fileId: string,
    public readonly createdAt: Date,
  ) {}
}
