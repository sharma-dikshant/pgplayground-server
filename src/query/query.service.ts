import { HttpException, Injectable } from '@nestjs/common';
import { UserSchemaService } from 'src/user-schema/user-schema.service';
import { DataSource } from 'typeorm';

function buildQuery(q: string, schema: string) {
  return q.replaceAll('<', `${schema}.`).replaceAll('>', '');
}

@Injectable()
export class QueryService {
  constructor(
    private dataSource: DataSource,
    private userSchemaService: UserSchemaService,
  ) {}
  async execute(userId: string, query: string) {
    const userSchema = await this.userSchemaService.findByUserId(userId);
    if (!userSchema) throw new Error('User schema not found');

    const qr = this.dataSource.createQueryRunner();
    await qr.connect();

    try {
      await qr.query(`SET ROLE "${userSchema.role}"`);
      const res = await qr.query(buildQuery(query, userSchema.name));
      return res;
    } catch (error) {
      throw new HttpException(error.message, 400);
    } finally {
      await qr.query('RESET ROLE');
      await qr.release();
    }
  }
}
