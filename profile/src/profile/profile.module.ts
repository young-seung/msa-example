import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import ProfileEntity from './infrastructure/entity/profile.entity';
import ProfileController from './profile.controller';
import ProfileRepository from './infrastructure/repository/profile.repository';
import CreateProfileCommandHandler from './application/command/handler/profile.handler.command.create';

const commandHandler = [CreateProfileCommandHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([ProfileEntity])],
  controllers: [ProfileController],
  providers: [ProfileRepository, ...commandHandler],
})
export default class ProfileModule {}
