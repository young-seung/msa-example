import { Controller, Post, Body, Get, Query, Param, Put, Delete } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiUseTags } from '@nestjs/swagger';

import CreateProfileDTO from '@src/profile/dto/profile.dto.create';
import CreateProfileCommand from '@src/profile/application/command/implements/profile.command.create';
import ReadProfileListDTO from '@src/profile/dto/profile.dto.read.list';
import Profile from '@src/profile/domain/model/profile.model';
import ReadProfileListQuery from '@src/profile/application/query/implemenets/profile.query.list';
import ReadProfileDTO from '@src/profile/dto/profile.dto.read';
import ReadProfileQuery from '@src/profile/application/query/implemenets/profile.query';
import UpdateProfileParamDTO from '@src/profile/dto/profile.dto.update.param';
import UpdateProfileBodyDTO from '@src/profile/dto/profile.dto.update.body';
import UpdateProfileCommand from '@src/profile/application/command/implements/profile.command.update';
import UpdateProfileDTO from '@src/profile/dto/profile.dto.update';
import DeleteProfileDTO from '@src/profile/dto/profile.dto.delete';
import DeleteProfileCommand from '@src/profile/application/command/implements/profile.command.delete';

@ApiUseTags('Profiles')
@Controller('profiles')
export default class ProfileController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @Post()
  create(@Body() body: CreateProfileDTO): Promise<void> {
    return this.commandBus.execute(new CreateProfileCommand(body));
  }

  @Get()
  getProfileList(@Query() query: ReadProfileListDTO): Promise<Profile> {
    return this.queryBus.execute(new ReadProfileListQuery(query));
  }

  @Get(':id')
  getProfile(@Query() query: ReadProfileDTO): Promise<Profile> {
    return this.queryBus.execute(new ReadProfileQuery(query));
  }

  @Put(':id')
  updateProfile(
    @Param() param: UpdateProfileParamDTO,
    @Body() body: UpdateProfileBodyDTO,
  ): Promise<void> {
    return this.commandBus.execute(new UpdateProfileCommand(new UpdateProfileDTO(param, body)));
  }

  @Delete(':id')
  deleteProfile(@Param() param: DeleteProfileDTO): Promise<void> {
    return this.commandBus.execute(new DeleteProfileCommand(new DeleteProfileDTO(param.id)));
  }
}
