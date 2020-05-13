import { ApiModelProperty } from '@nestjs/swagger';

export default class UpdateProfileBodyDTO {
  @ApiModelProperty({ example: 'test2' })
  public readonly newName: string;

  constructor(newName: string) {
    this.newName = newName;
  }
}
