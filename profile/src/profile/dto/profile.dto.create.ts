import { ApiModelProperty } from '@nestjs/swagger';

export default class CreateProfileDTO {
  @ApiModelProperty({ example: 'test@test.com' })
  public readonly email: string;

  @ApiModelProperty({ example: 'tester1' })
  public readonly name: string;

  constructor(email: string, name: string) {
    this.email = email;
    this.name = name;
  }
}
