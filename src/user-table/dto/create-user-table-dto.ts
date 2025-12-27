import { IsString } from 'class-validator';

type Column = {
  name: string;
  datatype: 'boolean' | 'int' | 'varchar' | 'text';
};

export class CreateUserTableDto {
  @IsString()
  tableName: string;
  schema: Column[];
}
