import { Module } from '@nestjs/common';

import AppController from '@src/app.controller';
import Publisher from '@src/users/rabbitmq/publisher';
import Consumer from '@src/users/rabbitmq/consumer';
import UsersModule from '@src/users/users.module';
import ApplicationService from '@src/app.service';

@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [Publisher, Consumer, ApplicationService],
})
export default class ApplicationModule {}
