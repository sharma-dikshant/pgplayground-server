import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
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
