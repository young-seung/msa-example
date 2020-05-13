import { ApiModelProperty } from '@nestjs/swagger';

export default class ReadProfileListDTO {
  @ApiModelProperty({ example: 'test@test.com', required: false })
  public readonly email?: string;

  constructor(email?: string) {
    this.email = email;
  }
}
