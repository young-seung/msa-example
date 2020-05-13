import UpdateProfileDTO from '../../../dto/profile.dto.update';

export default class UpdateProfileCommand {
  public readonly id: string;

  public readonly newName: string;

  constructor(dto: UpdateProfileDTO) {
    this.id = dto.id;
    this.newName = dto.newName;
  }
}
