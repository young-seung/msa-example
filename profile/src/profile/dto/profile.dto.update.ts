import UpdateProfileParamDTO from '@src/profile/dto/profile.dto.update.param';
import UpdateProfileBodyDTO from '@src/profile/dto/profile.dto.update.body';

export default class UpdateProfileDTO {
  public readonly id: string;

  public readonly newName: string;

  constructor(param: UpdateProfileParamDTO, body: UpdateProfileBodyDTO) {
    this.id = param.id;
    this.newName = body.newName;
  }
}
