import { Body, Controller, Headers, Post } from '@nestjs/common';
import { QueryService } from './query.service';

@Controller('query')
export class QueryController {
  constructor(private queryService: QueryService) {}
  @Post()
  execute(@Headers('X-Session') userId: string, @Body('query') query) {
    return this.queryService.execute(userId, query);
  }
}
