import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { UserSchemaModule } from './user-schema/user-schema.module';
import { UserTableModule } from './user-table/user-table.module';
import { QueryModule } from './query/query.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'pgplayground',
      synchronize: true,
      logging: true,
      autoLoadEntities: true,
      entities: [],
      subscribers: [],
    }),
    UserModule,
    UserSchemaModule,
    UserTableModule,
    QueryModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
