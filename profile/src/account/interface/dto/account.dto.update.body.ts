import { ApiModelProperty } from '@nestjs/swagger';

export default class UpdateAccountBodyDTO {
  @ApiModelProperty({ example: 'testpassword' })
  public readonly newPassword: string;

  @ApiModelProperty({ example: 'testpassword' })
  public readonly oldPassword: string;

  constructor(newPassword: string, oldPassword: string) {
    this.newPassword = newPassword;
    this.oldPassword = oldPassword;
  }
}
