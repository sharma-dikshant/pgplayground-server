import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateUserSchemaDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
