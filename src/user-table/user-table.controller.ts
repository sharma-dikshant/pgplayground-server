import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { UserTableService } from './user-table.service';
import { CreateUserTableDto } from './dto/create-user-table-dto';

@Controller('tables')
export class UserTableController {
  constructor(private readonly userTableService: UserTableService) {}
  @Post()
  create(@Headers('X-Session') userId: string, @Body() createUserTableDto: CreateUserTableDto) {
    return this.userTableService.create(userId, createUserTableDto);
  }

  @Get('describe/:tableName')
  describe(@Headers('X-Session') userId: string, @Param('tableName') tableName: string) {
    return this.userTableService.describe(userId, tableName);
  }

  @Post('seeds')
  seed(@Headers('X-Session') userId: string, @Body() body: { tableName: string; rows: number }) {
    const { tableName, rows } = body;
    return this.userTableService.seedData(userId, tableName, rows);
  }

  @Get('users')
  findAll(@Headers('X-Session') userId: string) {
    return this.userTableService.findAll(userId);
  }
}
