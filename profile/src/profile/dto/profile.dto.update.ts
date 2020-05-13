import UpdateProfileParamDTO from './profile.dto.update.param';
import UpdateProfileBodyDTO from './profile.dto.update.body';

export default class UpdateProfileDTO {
  public readonly id: string;

  public readonly newName: string;

  constructor(param: UpdateProfileParamDTO, body: UpdateProfileBodyDTO) {
    this.id = param.id;
    this.newName = body.newName;
  }
}
