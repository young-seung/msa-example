import ReadProfileDTO from '../../../dto/profile.dto.read';

export default class ReadProfileQuery {
  public readonly id: string;

  constructor(dto: ReadProfileDTO) {
    this.id = dto.id;
  }
}
