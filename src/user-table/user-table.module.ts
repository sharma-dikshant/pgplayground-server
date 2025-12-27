import { Module } from '@nestjs/common';
import { UserTableController } from './user-table.controller';
import { UserTableService } from './user-table.service';
import { UserSchemaModule } from 'src/user-schema/user-schema.module';

@Module({
  imports: [UserSchemaModule],
  controllers: [UserTableController],
  providers: [UserTableService],
})
export class UserTableModule {}
