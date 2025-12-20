import { Controller, Get, Post, Body, Param, Headers, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserTableDto } from './dto/create-user-table.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/id')
  generateId() {
    return this.usersService.generateId();
  }

  @Post('tables')
  create(@Headers('X-Session') userId: string, @Body() createUserTableDto: CreateUserTableDto) {
    return this.usersService.create(userId, createUserTableDto);
  }

  @Get('tables/describe/:tableName')
  describe(@Headers('X-Session') userId: string, @Param('tableName') tableName: string) {
    return this.usersService.describe(tableName);
  }

  @Post('/query')
  @HttpCode(200)
  executeQuery(@Headers('X-Session') userId: string, @Param('id') id: string, @Body() body: { query: string }) {
    const { query } = body;

    return this.usersService.executeQuery(userId, query);
  }

  @Post('tables/seeds')
  seed(@Headers('X-Session') userId: string, @Body() body: { tableName: string; rows: number }) {
    const { tableName, rows } = body;
    return this.usersService.seedData(userId, tableName, rows);
  }

  @Get('/tables')
  findAll(@Headers('X-Session') userId: string) {
    return this.usersService.findAll(userId);
  }
}
