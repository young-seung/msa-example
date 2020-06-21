import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import AppController from '@src/app.controller';
import AppConfiguration from '@src/app.config';
import Publisher from '@src/users/rabbitmq/publisher';
import Consumer from '@src/users/rabbitmq/consumer';
import UsersModule from '@src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: AppConfiguration.DATABASE_TYPE,
      host: AppConfiguration.DATABASE_HOST,
      port: AppConfiguration.DATABASE_PORT,
      database: AppConfiguration.DATABASE_NAME,
      username: AppConfiguration.DATABASE_USER,
      password: AppConfiguration.DATABASE_PASSWORD,
      synchronize: true,
      logging: true,
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [Publisher, Consumer],
})
export default class ApplicationModule {
  constructor(private readonly connection: Connection) {}
}
