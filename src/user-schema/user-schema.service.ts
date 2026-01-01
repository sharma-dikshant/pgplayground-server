import { Injectable } from '@nestjs/common';
import { CreateUserSchemaDto } from './dto/create-user-schema.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSchema } from './entities/user-schema.entity';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UserSchemaService {
  constructor(
    @InjectRepository(UserSchema) private userSchemaRepo: Repository<UserSchema>,
    private dataSource: DataSource,
  ) {}

  async create(createUserSchemaDto: CreateUserSchemaDto) {
    const slug = createUserSchemaDto.userId.replace(/-/g, '').slice(0, 12);

    const schemaName = `scma_${slug}`;
    const roleName = `role_${slug}`;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1️⃣ Create role (NO LOGIN needed)
      await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_roles WHERE rolname = '${roleName}'
        ) THEN
          CREATE ROLE "${roleName}";
        END IF;
      END
      $$;
    `);

      // 2️⃣ Create schema
      await queryRunner.query(`
      CREATE SCHEMA IF NOT EXISTS "${schemaName}"
      AUTHORIZATION "${roleName}";
    `);

      // 3️⃣ Grant permissions
      await queryRunner.query(`
      GRANT USAGE, CREATE ON SCHEMA "${schemaName}" TO "${roleName}";

      ALTER DEFAULT PRIVILEGES IN SCHEMA "${schemaName}"
      GRANT ALL ON TABLES TO "${roleName}";

      ALTER DEFAULT PRIVILEGES IN SCHEMA "${schemaName}"
      GRANT ALL ON SEQUENCES TO "${roleName}";
    `);

      // 4️⃣ Save metadata
      await this.userSchemaRepo.save({
        name: schemaName,
        userId: createUserSchemaDto.userId,
        role: roleName,
      });

      await queryRunner.commitTransaction();
      return { schemaName, roleName };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findByUserId(userId: string) {
    const res = await this.userSchemaRepo.findOne({ where: { userId } });
    return res;
  }

  async delete(id: string) {
    await this.userSchemaRepo.softDelete({ id });
    return null;
  }
}
