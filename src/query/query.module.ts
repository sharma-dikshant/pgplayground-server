import { Module } from '@nestjs/common';
import { QueryService } from './query.service';
import { UserSchemaModule } from 'src/user-schema/user-schema.module';
import { QueryController } from './query.controller';

@Module({
  imports: [UserSchemaModule],
  providers: [QueryService],
  controllers: [QueryController],
})
export class QueryModule {}
