import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserSchemaModule } from 'src/user-schema/user-schema.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UserSchemaModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
