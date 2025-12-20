import { IsString } from 'class-validator';
import { ALLOWED_DATATYPE } from 'src/constants/datatypes';
import { ALLOWED_COLUMNS } from 'src/constants/allowed_columns';

type Column = {
  name: (typeof ALLOWED_COLUMNS)[number];
  datatype: ALLOWED_DATATYPE;
};

export class CreateUserTableDto {
  @IsString()
  tableName: string;
  schema: Column[];
}

/**
 
[
    {
        name: 'id',
        datatype: 'int'
    },
    {
        name: 'name',
        datatype: 'varchar'
    }
]
    
 */
