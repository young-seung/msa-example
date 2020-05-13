import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import AppConfiguration from '../app.config';
import ReadProfileQuery from '../profile/application/query/implemenets/profile.query';
import ReadProfileDTO from '../profile/dto/profile.dto.read';
import Profile from '../profile/domain/model/profile.model';

type PayloadType = { id: string; email: string; name: string };

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly queryBus: QueryBus) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: AppConfiguration.JWT_SECRET,
    });
  }

  private async validate(payload: PayloadType): Promise<PayloadType | false> {
    const dto = new ReadProfileDTO(payload.id);
    const profile: Profile = await this.queryBus.execute(new ReadProfileQuery(dto));
    return profile && profile.email === payload.email && profile.name === payload.name
      ? payload
      : false;
  }
}
