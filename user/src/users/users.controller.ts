import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import CreateUserDto from '@src/users/dto/create';
import CreateUserCommand from '@src/users/command/create';
import UpdateUserDto from '@src/users/dto/update';
import UpdateUserCommand from '@src/users/command/update';
import DeleteUserCommand from '@src/users/command/delete';
import FindUserByIdQuery from '@src/users/query/findById';
import FindUserDto from '@src/users/dto/find';
import FindUserQuery from '@src/users/query/find';
import CreateUserResponse from '@src/users/dto/create.response';
import UpdateUserResponse from '@src/users/dto/update.response';
import DeleteUserResponse from '@src/users/dto/delete.response';
import FindUserByIdResponse from '@src/users/dto/findById.response';
import FindUserResponse from '@src/users/dto/find.response';
import FindUserQueryResult from '@src/users/query/find.result';
import FindUserByIdQueryResult from '@src/users/query/findById.result';

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
    const result: FindUserByIdQueryResult = await this.queryBus.execute(query);
    return { message: 'success', result };
  }

  @Get()
  public async find(@Query() dto: FindUserDto): Promise<FindUserResponse> {
    const { cursorId, take } = dto;
    const query = new FindUserQuery(cursorId, Number(take));
    const result: FindUserQueryResult = await this.queryBus.execute(query);
    return { message: 'success', result };
  }
}
