import moment from 'moment';
import Profile from '../../domain/model/profile.model';

export default class UpdateProfileMapper {
  public readonly id: string;

  public readonly name: string;

  public readonly email: string;

  public readonly updatedAt: string;

  constructor(profile: Profile) {
    this.id = profile.id;
    this.name = profile.name;
    this.email = profile.email;
    this.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  }
}
