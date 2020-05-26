import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import CreateUserDto from './dto/create';
import CreateUserCommand from './command/create';
import UpdateUserDto from './dto/update';
import UpdateUserCommand from './command/update';
import DeleteUserCommand from './command/delete';
import FindUserByIdQuery from './query/findById';
import FindUserDto from './dto/find';
import FindUserQuery from './query/find';
import CreateUserResponse from './dto/create.response';
import UpdateUserResponse from './dto/update.response';
import DeleteUserResponse from './dto/delete.response';
import FindUserByIdResponse from './dto/findById.response';
import FindUserResponse from './dto/find.response';

@Controller('users')
export default class UsersController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @Post()
  public async create(@Body() dto: CreateUserDto): Promise<CreateUserResponse> {
    const { email, password } = dto;
    const command = new CreateUserCommand(email, password);
    const result = await this.commandBus.execute(command);
    return new CreateUserResponse('created', result);
  }

  @Put('/:userId')
  public async update(
    @Param('userId') userId: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UpdateUserResponse> {
    const { password } = dto;
    const command = new UpdateUserCommand(userId, password);
    const result = await this.commandBus.execute(command);
    return new UpdateUserResponse('success', result);
  }

  @Delete('/:userId')
  public async delete(@Param('userId') userId: string): Promise<DeleteUserResponse> {
    const command = new DeleteUserCommand(userId);
    const result = await this.commandBus.execute(command);
    return new DeleteUserResponse('success', result);
  }

  @Get('/:userId')
  public async findById(@Param('userId') userId: string): Promise<FindUserByIdResponse> {
    const query = new FindUserByIdQuery(userId);
    const result = await this.queryBus.execute(query);
    return { message: 'success', result };
  }

  @Get()
  public async find(@Query() dto: FindUserDto): Promise<FindUserResponse> {
    const { cursorId, take } = dto;
    const query = new FindUserQuery(cursorId, Number(take));
    const result = await this.queryBus.execute(query);
    return { message: 'success', result };
  }
}
