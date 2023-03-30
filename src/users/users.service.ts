import {
  HttpException,
  HttpStatus,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEnum } from '@app/core/enums';
import { UserEntity } from 'src/users/entities';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class UsersService implements OnApplicationBootstrap {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedAdmins();
  }

  async seedAdmins() {
    // const users = this.configService
    //   .get<string>('ADMIN_USERS')
    //   .split(',')
    //   .map(Number);

    // await Promise.all(
    //   users.map(async (vk_user_id) => {
    //     await this.usersRepository.save({
    //       vk_user_id,
    //       role: RoleEnum.ADMIN,
    //     });
    //   }),
    // );
  }

  async isAdmin(user: UserEntity) {
    return { isAdmin: user.permissions === RoleEnum.ADMIN };
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user)
      throw new HttpException('Пользователь не найден.', HttpStatus.NO_CONTENT);

    return {
      ...user,
    };
  }

  async changeRole(id: number, role: RoleEnum): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    return await this.usersRepository.save({ ...user, role });
  }

  async getSelf(user: UserEntity): Promise<any> {

    return user;
  }

  async getStaff() {
    let staff = await this.usersRepository.findBy({ permissions: RoleEnum.SPECIAL })
    let ids = staff.map((user) => user.id);

    return ids;
  }
}
