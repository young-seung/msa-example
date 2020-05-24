import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import AppController from './app.controller';
import AppConfiguration from './app.config';
import UsersController from './users/users.controller';
import User from './users/entity/user';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forRoot({
      type: AppConfiguration.DATABASE_TYPE,
      host: AppConfiguration.DATABASE_HOST,
      port: AppConfiguration.DATABASE_PORT,
      database: AppConfiguration.DATABASE_NAME,
      username: AppConfiguration.DATABASE_USER,
      password: AppConfiguration.DATABASE_PASSWORD,
      synchronize: true,
      logging: true,
      entities: [User],
    }),
  ],
  controllers: [AppController, UsersController],
  providers: [],
})
export default class ApplicationModule {
  constructor(private readonly connection: Connection) {}
}
