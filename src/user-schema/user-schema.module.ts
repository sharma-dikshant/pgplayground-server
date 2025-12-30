import { Module } from '@nestjs/common';
import { UserSchemaService } from './user-schema.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema } from './entities/user-schema.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema])],
  controllers: [],
  providers: [UserSchemaService],
  exports: [UserSchemaService],
})
export class UserSchemaModule {}
