import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
  AuthorizationGuard, 
  RolesGuard 
} from '@app/core/guards';
import { UserEntity } from './users/entities';
import { UsersModule } from './users/users.module';
import { StorageModule } from './storage/storage.module';
import { MarketModule } from './market/market.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT ?? ''),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: true,
      autoLoadEntities: true,
      // logging: true
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity]),
    UsersModule,
    StorageModule,
    MarketModule,
    
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: AuthorizationGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
