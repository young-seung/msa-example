import DeleteProfileDTO from '../../../dto/profile.dto.delete';

export default class DeleteProfileCommand {
  public readonly id: string;

  constructor(dto: DeleteProfileDTO) {
    this.id = dto.id;
  }
}
