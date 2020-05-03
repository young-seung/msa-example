export default class CreateProfileMapper {
  public readonly name: string;

  public readonly email: string;

  public readonly createdAt: Date;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
    this.createdAt = new Date();
  }
}
