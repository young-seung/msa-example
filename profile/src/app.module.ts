import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import ProfileModule from '@src/profile/profile.module';
import AppController from '@src/app.controller';
import AppConfiguration from '@src/app.config';
import ProfileEntity from '@src/profile/infrastructure/entity/profile.entity';

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
      entities: [ProfileEntity],
    }),
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [],
})
export default class ApplicationModule {
  constructor(private readonly connection: Connection) {}
}
