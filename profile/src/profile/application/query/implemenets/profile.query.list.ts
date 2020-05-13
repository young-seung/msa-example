import ReadProfileListDTO from '../../../dto/profile.dto.read.list';

export default class ReadProfileListQuery {
  public readonly email?: string;

  constructor(dto: ReadProfileListDTO) {
    this.email = dto.email;
  }
}
