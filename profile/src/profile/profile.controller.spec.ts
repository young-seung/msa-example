import { Test, TestingModule } from '@nestjs/testing';
import { CqrsModule, CommandBus } from '@nestjs/cqrs';
import { INestApplication } from '@nestjs/common';
import ProfileController from './profile.controller';
import CreateProfileDTO from './dto/profile.dto.create';
import CreateProfileCommand from './application/command/implements/profile.command.create';

describe('Profile Controller', () => {
  let module: TestingModule;
  let app: INestApplication;
  let profileController: ProfileController;
  let commandBus: CommandBus;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [ProfileController],
    }).compile();

    app = module.createNestApplication();

    await app.init();

    profileController = module.get(ProfileController);
    commandBus = module.get(CommandBus);
  });

  afterAll(async (): Promise<void> => app.close());

  describe('create', () => {
    const email = 'test@test.com';
    const name = 'tester1';
    const createProfileDto = new CreateProfileDTO(email, name);
    const createProfileCommand = new CreateProfileCommand(createProfileDto);

    it('create method call commandBus with command', async () => {
      const spy = jest.spyOn(commandBus, 'execute').mockImplementation(() => Promise.resolve());
      await profileController.create(createProfileDto);
      expect(spy).toBeCalledWith(createProfileCommand);
    });
  });
});
