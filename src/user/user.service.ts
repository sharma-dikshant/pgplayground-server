import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSchemaService } from 'src/user-schema/user-schema.service';
import { DataSource } from 'typeorm';
import { UserSchema } from 'src/user-schema/entities/user-schema.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private userSchemaService: UserSchemaService,
    private dataSource: DataSource,
  ) {}
  async create() {
    const u = this.userRepo.create({});
    await this.userRepo.save(u);
    await this.userSchemaService.create({ userId: u.id });
    return {
      id: u.id,
    };
  }

  async delete(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const userSchema = await this.userSchemaService.findByUserId(userId);

    if (!user) {
      throw new HttpException(`no user exist with ${userId}`, 404);
    }

    if (!userSchema) {
      await this.userRepo.softDelete({ id: userId });
      return {
        message: 'user deleted (no schema existed)',
      };
    }

    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const schemaName = userSchema.name;
      const roleName = userSchema.role;

      await qr.query(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`);

      // Drop role
      await qr.query(`DROP ROLE IF EXISTS "${roleName}"`);

      // Delete metadata USING SAME TRANSACTION
      await qr.manager.getRepository(UserSchema).softDelete({
        userId,
      });

      // Soft delete user
      await qr.manager.getRepository(User).softDelete({
        id: userId,
      });

      await qr.commitTransaction();

      return {
        message: 'successfully deleted user and related resources',
      };
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }
}
