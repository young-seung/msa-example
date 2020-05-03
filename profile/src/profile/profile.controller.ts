import { Controller, Post, Body } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiUseTags } from '@nestjs/swagger';
import CreateProfileDTO from './dto/profile.dto.create';
import CreateProfileCommand from './application/command/implements/profile.command.create';

@ApiUseTags('Profiles')
@Controller('profiles')
export default class ProfileController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  create(@Body() body: CreateProfileDTO): Promise<void> {
    return this.commandBus.execute(new CreateProfileCommand(body));
  }
}
