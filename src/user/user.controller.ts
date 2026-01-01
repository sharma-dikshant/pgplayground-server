import { Controller, Post, Param, Delete, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create() {
    return this.userService.create();
  }

  @Delete('/:id')
  // @HttpCode(204)
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
