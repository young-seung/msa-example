import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import ProfileEntity from '@src/profile/infrastructure/entity/profile.entity';
import ProfileController from '@src/profile/profile.controller';
import ProfileRepository from '@src/profile/infrastructure/repository/profile.repository';
import CreateProfileCommandHandler from '@src/profile/application/command/handlers/profile.handler.command.create';
import ReadProfileListQueryHandler from '@src/profile/application/query/handlers/profile.handler.query.list';
import ReadProfileQueryHandler from '@src/profile/application/query/handlers/profile.handler.query';
import UpdateProfileCommandHandler from '@src/profile/application/command/handlers/profile.handler.command.update';
import DeleteProfileCommandHandler from '@src/profile/application/command/handlers/profile.handler.command.delete';
import Consumer from '@src/profile/infrastructure/message/consumer';

const commandHandler = [
  CreateProfileCommandHandler,
  UpdateProfileCommandHandler,
  DeleteProfileCommandHandler,
];

const queryHandler = [ReadProfileListQueryHandler, ReadProfileQueryHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([ProfileEntity])],
  controllers: [ProfileController],
  providers: [ProfileRepository, Consumer, ...commandHandler, ...queryHandler],
})
export default class ProfileModule {}
