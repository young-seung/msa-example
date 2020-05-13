import { FindOperator, IsNull } from 'typeorm';

export default class ReadProfileMapper {
  public readonly id: string;

  public readonly deleteAt: FindOperator<string>;

  constructor(id: string) {
    this.id = id;
    this.deleteAt = IsNull();
  }
}
