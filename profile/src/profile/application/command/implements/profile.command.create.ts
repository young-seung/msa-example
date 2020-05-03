import CreateProfileDTO from '../../../dto/profile.dto.create';

export default class CreateProfileCommand {
  public readonly email: string;

  public readonly name: string;

  constructor(createProfileDto: CreateProfileDTO) {
    this.email = createProfileDto.email;
    this.name = createProfileDto.name;
  }
}
