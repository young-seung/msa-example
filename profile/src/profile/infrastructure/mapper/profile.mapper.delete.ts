import moment from 'moment';
import Profile from '../../domain/model/profile.model';

export default class DeleteProfileMapper {
  public readonly id: string;

  public readonly name: string;

  public readonly email: string;

  public readonly deletedAt: string;

  constructor(profile: Profile) {
    this.id = profile.id;
    this.name = profile.name;
    this.email = profile.email;
    this.deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  }
}
