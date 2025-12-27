import { UserSchemaService } from 'src/user-schema/user-schema.service';
import { DataSource } from 'typeorm';
import { CreateUserTableDto } from './dto/create-user-table-dto';
import { ALLOWED_DATATYPE } from 'src/constants/datatypes';
import { Injectable } from '@nestjs/common';
import { fakeRow } from 'src/constants/allowed_columns';

function quoteIdent(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

function buildCreateTableSQL(schemaName: string, tableName: string, columns: { name: string; datatype: keyof typeof ALLOWED_DATATYPE }[]) {
  const cols = columns.map((c) => `${quoteIdent(c.name)} ${ALLOWED_DATATYPE[c.datatype]}`).join(', ');

  return `
    CREATE TABLE ${quoteIdent(schemaName)}.${quoteIdent(tableName)}
    (${cols});
  `;
}

function generateFakeValue(column: string) {
  const generator = fakeRow[column];
  if (!generator) return null;

  const value = generator();

  if (value instanceof Date) return value.toISOString();
  return value;
}

@Injectable()
export class UserTableService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userSchemaService: UserSchemaService,
  ) {}

  async create(userId: string, dto: CreateUserTableDto) {
    const { tableName, schema } = dto;

    const userSchema = await this.userSchemaService.findByUserId(userId);
    if (!userSchema) throw new Error('User schema not found');

    const qr = this.dataSource.createQueryRunner();
    await qr.connect();

    try {
      // 🔐 Switch role (DB-level isolation)
      await qr.query(`SET ROLE "${userSchema.role}"`);

      const sql = buildCreateTableSQL(userSchema.name, tableName, schema);
      await qr.query(sql);

      return {
        message: 'table created',
        tableName,
        schema: userSchema.name,
      };
    } finally {
      await qr.query('RESET ROLE');
      await qr.release();
    }
  }

  async findAll(userId: string) {
    const userSchema = await this.userSchemaService.findByUserId(userId);
    if (!userSchema) throw new Error('User schema not found');

    const qr = this.dataSource.createQueryRunner();
    await qr.connect();

    try {
      await qr.query(`SET ROLE "${userSchema.role}"`);

      const res = await qr.query(
        `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = $1
          AND table_type = 'BASE TABLE'
        `,
        [userSchema.name],
      );

      return res;
    } finally {
      await qr.query('RESET ROLE');
      await qr.release();
    }
  }

  async seedData(userId: string, tableName: string, rows = 10) {
    const userSchema = await this.userSchemaService.findByUserId(userId);
    if (!userSchema) throw new Error('User schema not found');

    const qr = this.dataSource.createQueryRunner();
    await qr.connect();

    try {
      // 🔐 Switch role
      await qr.query(`SET ROLE "${userSchema.role}"`);

      // 1️⃣ Get table columns (schema-scoped)
      const columns: { column_name: string }[] = await qr.query(
        `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = $1
        AND table_name = $2
      ORDER BY ordinal_position
      `,
        [userSchema.name, tableName],
      );

      if (!columns.length) {
        throw new Error('Table not found or has no columns');
      }

      const columnNames = columns.map((c) => c.column_name);

      // 2️⃣ Build INSERT statement
      const quotedColumns = columnNames.map(quoteIdent).join(', ');

      const values: any[] = [];
      const rowsSql: string[] = [];

      let paramIndex = 1;

      for (let i = 0; i < rows; i++) {
        const rowPlaceholders: string[] = [];

        for (const col of columnNames) {
          values.push(generateFakeValue(col));
          rowPlaceholders.push(`$${paramIndex++}`);
        }

        rowsSql.push(`(${rowPlaceholders.join(', ')})`);
      }

      const insertSql = `
        INSERT INTO ${quoteIdent(userSchema.name)}.${quoteIdent(tableName)}
        (${quotedColumns})
        VALUES ${rowsSql.join(', ')}
      `;

      // 3️⃣ Execute insert
      await qr.query(insertSql, values);

      return {
        message: 'seed data inserted',
        table: tableName,
        rowsInserted: rows,
      };
    } finally {
      await qr.query('RESET ROLE');
      await qr.release();
    }
  }

  async describe(userId: string, tableName: string) {
    const userSchema = await this.userSchemaService.findByUserId(userId);
    if (!userSchema) throw new Error('User schema not found');

    const qr = this.dataSource.createQueryRunner();
    await qr.connect();

    try {
      await qr.query(`SET ROLE "${userSchema.role}"`);

      const res = await qr.query(
        `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = $1
          AND table_name = $2
        `,
        [userSchema.name, tableName],
      );

      return res;
    } finally {
      await qr.query('RESET ROLE');
      await qr.release();
    }
  }
}
