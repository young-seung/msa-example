import { ApiModelProperty } from '@nestjs/swagger';

export default class DeleteProfileDTO {
  @ApiModelProperty()
  public readonly id: string;

  constructor(id: string) {
    this.id = id;
  }
}
