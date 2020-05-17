import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  Request,
  Param,
  HttpException,
  HttpStatus,
  Put,
  Delete,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import CreateProfileDTO from './dto/profile.dto.create';
import CreateProfileCommand from './application/command/implements/profile.command.create';
import ReadProfileListDTO from './dto/profile.dto.read.list';
import Profile from './domain/model/profile.model';
import ReadProfileListQuery from './application/query/implemenets/profile.query.list';
import ProfileUserDTO from './dto/profile.dto.user';
import ReadProfileDTO from './dto/profile.dto.read';
import ReadProfileQuery from './application/query/implemenets/profile.query';
import UpdateProfileParamDTO from './dto/profile.dto.update.param';
import UpdateProfileBodyDTO from './dto/profile.dto.update.body';
import UpdateProfileCommand from './application/command/implements/profile.command.update';
import UpdateProfileDTO from './dto/profile.dto.update';
import DeleteProfileDTO from './dto/profile.dto.delete';
import DeleteProfileCommand from './application/command/implements/profile.command.delete';

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
