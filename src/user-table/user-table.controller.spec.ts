import { Test, TestingModule } from '@nestjs/testing';
import { UserTableController } from './user-table.controller';

describe('UserTableController', () => {
  let controller: UserTableController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserTableController],
    }).compile();

    controller = module.get<UserTableController>(UserTableController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
