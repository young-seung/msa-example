import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { IsNull } from 'typeorm';
import { QueryHandler, EventPublisher, IQueryHandler } from '@nestjs/cqrs';
import ProfileEntity from '../../../infrastructure/entity/profile.entity';
import ProfileRepository from '../../../infrastructure/repository/profile.repository';
import ReadProfileListQuery from '../implemenets/profile.query.list';
import AppConfiguration from '../../../../app.config';

const { JWT_SECRET, JWT_EXPIRATION } = AppConfiguration;

@QueryHandler(ReadProfileListQuery)
export default class ReadProfileListQueryHandler {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly repository: ProfileRepository,
  ) {}

  async execute() {
    const data = await this.repository.find({ deletedAt: IsNull() }).catch(() => {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    });

    const profiles = new Array();

    if (data.length > 0) {
      data.forEach((element) => {
        profiles.push({
          id: element.id,
          access: jwt.sign(
            { id: element.id, email: element.email, name: element.name },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION },
          ),
        });
      });
      return {
        profiles: profiles,
      };
    } else {
      return {};
    }
  }
}
