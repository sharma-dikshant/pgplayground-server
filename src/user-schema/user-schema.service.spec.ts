import { Test, TestingModule } from '@nestjs/testing';
import { UserSchemaService } from './user-schema.service';

describe('UserSchemaService', () => {
  let service: UserSchemaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSchemaService],
    }).compile();

    service = module.get<UserSchemaService>(UserSchemaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
