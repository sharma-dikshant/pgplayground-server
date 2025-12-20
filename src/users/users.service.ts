import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserTableDto } from './dto/create-user-table.dto';
import { DataSource } from 'typeorm';
import { fakeRow } from 'src/constants/allowed_columns';
import { ALLOWED_DATATYPE } from 'src/constants/datatypes';

@Injectable()
export class UsersService {
  constructor(private dataSource: DataSource) {}

  generateId() {
    return {
      message: 'success',
      id: fakeRow.uuid,
    };
  }

  async create(userId, createUserTableDto: CreateUserTableDto) {
    try {
      const { tableName, schema } = createUserTableDto;

      const table = `${tableName}_${userId}`;
      let c = '';

      schema.forEach((element) => {
        c += `${element.name} ${ALLOWED_DATATYPE[element.datatype]},`;
      });

      if (c.endsWith(',')) {
        c = c.slice(0, -1);
      }

      const q = `CREATE TABLE ${table} ( ${c} );`;
      const res: any = await this.dataSource.query(q);

      return {
        message: 'success',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async seedData(userId: string, tableName: string, rows: number) {
    try {
      const _tableName = `${tableName}_${userId}`;

      const q = `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = '${_tableName}';
      `;

      const res: any[] = await this.dataSource.query(q);
      let t = '';

      for (let i = 1; i <= rows; i++) {
        let x = '';

        res.forEach((col) => {
          const val = fakeRow[col.column_name];
          x += `'${val}',`;
        });

        if (x.endsWith(',')) {
          x = x.slice(0, -1);
        }

        t += `(${x}),`;
      }

      if (t.endsWith(',')) {
        t = t.slice(0, -1);
      }

      await this.dataSource.query(`INSERT INTO ${_tableName} VALUES ${t}`);

      return {
        message: 'success',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async findAll(userId: string) {
    try {
      const q = `SELECT table_name, table_schema FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE '%${userId}'`;
      const res = await this.dataSource.query(q);

      return {
        message: 'success',
        q,
        res,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async describe(tableName: string) {
    try {
      const q = `
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns
      WHERE table_name = '${tableName}';
      `;
      const res = await this.dataSource.query(q);

      return {
        message: 'success',
        res,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async executeQuery(userId: string, query: string) {
    try {
      const q = query.replaceAll('<', '').replaceAll('>', `_${userId}`);
      const res = await this.dataSource.query(q);
      return {
        message: 'success',
        res,
        q,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
}
