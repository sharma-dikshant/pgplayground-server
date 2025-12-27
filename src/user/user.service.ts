import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSchemaService } from 'src/user-schema/user-schema.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private userSchemaService: UserSchemaService,
  ) {}
  async create() {
    const u = this.userRepo.create({});
    await this.userRepo.save(u);
    await this.userSchemaService.create({ userId: u.id });
    return {
      id: u.id,
    };
  }
}
