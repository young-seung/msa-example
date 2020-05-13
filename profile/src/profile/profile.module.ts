import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import ProfileEntity from './infrastructure/entity/profile.entity';
import ProfileController from './profile.controller';
import ProfileRepository from './infrastructure/repository/profile.repository';
import CreateProfileCommandHandler from './application/command/handlers/profile.handler.command.create';
import ReadProfileListQueryHandler from './application/query/handlers/profile.handler.query.list';
import ReadProfileQueryHandler from './application/query/handlers/profile.handler.query';
import UpdateProfileCommandHandler from './application/command/handlers/profile.handler.command.update';
import DeleteProfileCommandHandler from './application/command/handlers/profile.handler.command.delete';

const commandHandler = [
  CreateProfileCommandHandler,
  UpdateProfileCommandHandler,
  DeleteProfileCommandHandler,
];

const queryHandler = [ReadProfileListQueryHandler, ReadProfileQueryHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([ProfileEntity])],
  controllers: [ProfileController],
  providers: [ProfileRepository, ...commandHandler, ...queryHandler],
})
export default class ProfileModule {}
