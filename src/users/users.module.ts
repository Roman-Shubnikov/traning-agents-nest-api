import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from 'src/users/users.controller';
import { UserEntity } from 'src/users/entities';
import { UsersService } from 'src/users/users.service';
import { ConfigModule } from '@nestjs/config';
import { StorageModule } from 'src/storage/storage.module';


@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity]),
    StorageModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule],
})
export class UsersModule {}
