import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { IsNull } from 'typeorm';
import { QueryHandler, EventPublisher, IQueryHandler } from '@nestjs/cqrs';
import ProfileEntity from '../../../infrastructure/entity/profile.entity';
import ProfileRepository from '../../../infrastructure/repository/profile.repository';
import ReadProfileListQuery from '../implemenets/profile.query.list';
import Profile from '../../../domain/model/profile.model';
import AppConfiguration from '../../../../app.config';

const { JWT_SECRET, JWT_EXPIRATION } = AppConfiguration;

@QueryHandler(ReadProfileListQuery)
export default class ReadProfileListQueryHandler {
  // implements IQueryHandler<ReadProfileListQuery> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly repository: ProfileRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute() {
    const data = await this.repository.find({ deletedAt: IsNull() }).catch(() => {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    });

    return data.length > 0
      ? {
        id: data[0].id,
        access: jwt.sign(
          { id: data[0].id, email: data[0].email, name: data[0].name },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRATION },
        ),
      }
      : {};
  }
}
