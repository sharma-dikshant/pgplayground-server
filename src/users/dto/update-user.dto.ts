import { PartialType } from '@nestjs/mapped-types';
import { CreateUserTableDto } from './create-user-table.dto';

export class UpdateUserDto extends PartialType(CreateUserTableDto) {}
