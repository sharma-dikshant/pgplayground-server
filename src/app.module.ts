import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      username: 'postgres',
      password: 'postgres',
      database: 'db_practice',
      synchronize: true,
      logging: true,
      entities: [],
      subscribers: [],
    }),
    UsersModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
