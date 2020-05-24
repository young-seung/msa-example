import { Test } from '@nestjs/testing';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import UsersController from './users.controller';
import CreateUserDto from './dto/create';
import CreateUserResponse from './dto/create.response';
import UpdateUserDto from './dto/update';
import UpdateUserResponse from './dto/update.response';
import DeleteUserResponse from './dto/delete.response';
import FindUserByIdResponse from './dto/findById.response';
import FindUserResponse from './dto/find.response';
import FindUserDto from './dto/find';

describe('UsersController', () => {
  let moduleMetaData: ModuleMetadata;
  let controller: UsersController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  beforeAll(async () => {
    moduleMetaData = { providers: [UsersController, CommandBus, QueryBus] };

    const testModule = await Test.createTestingModule(moduleMetaData).compile();

    controller = testModule.get('UsersController');
    commandBus = testModule.get('CommandBus');
    queryBus = testModule.get('QueryBus');
  });

  describe('create', () => {
    it('should return response body', () => {
      jest.spyOn(commandBus, 'execute').mockResolvedValue({});
      const dto = new CreateUserDto('email', 'password');
      const response = new CreateUserResponse('created', {});
      expect(controller.create(dto)).resolves.toEqual(response);
    });
  });

  describe('update', () => {
    it('should return response body', () => {
      jest.spyOn(commandBus, 'execute').mockResolvedValue({});
      const dto = new UpdateUserDto('password');
      const response = new UpdateUserResponse('success', {});
      expect(controller.update('userId', dto)).resolves.toEqual(response);
    });
  });

  describe('delete', () => {
    it('should return response body', () => {
      jest.spyOn(commandBus, 'execute').mockResolvedValue({});
      const response = new DeleteUserResponse('success', {});
      expect(controller.delete('userId')).resolves.toEqual(response);
    });
  });

  describe('findById', () => {
    it('should return response body', () => {
      jest.spyOn(queryBus, 'execute').mockResolvedValue({});
      const response = new FindUserByIdResponse('success', {});
      expect(controller.findById('userId')).resolves.toEqual(response);
    });
  });

  describe('find', () => {
    it('should return response body', () => {
      jest.spyOn(queryBus, 'execute').mockResolvedValue({});
      const dto = new FindUserDto('cursorId', '0');
      const response = new FindUserResponse('success', {});
      expect(controller.find(dto)).resolves.toEqual(response);
    });
  });
});
