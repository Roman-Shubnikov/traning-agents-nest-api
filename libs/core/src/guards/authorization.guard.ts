import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { parse, stringify } from 'querystring';
import { UserEntity } from 'src/users/entities';
import { Reflector } from '@nestjs/core';
import { SKIP_AUTHORIZATION } from '@app/core/decorators';
import { getTime } from '@app/utils';

const TOKEN_LIFETIME = 12 * 60 * 60 * 1000;

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly reflector: Reflector,
  ) {}

  private secret = this.configService.get<string>('VK_SECRET');

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (this.reflector.get<boolean>(SKIP_AUTHORIZATION, context.getHandler())) {
      return true;
    }

    const authorization = request.headers['authorization'] as string;
    if (!authorization || authorization.trim() === '') {
      throw new UnauthorizedException('Не указан токен в Authorization');
    }

    const [type, token] = authorization.split(' ');
    if (!token || type !== 'Bearer') {
      throw new UnauthorizedException('Токен невалиден, не хватает Bearer');
    }

    const data = parse(token);
    const vk_user_id = Number.parseInt(data.vk_user_id as string);
    const sign = data.sign as string;

    const signParams = {};

    for (const key of Object.keys(data).sort())
      if (key.slice(0, 3) === 'vk_') signParams[key] = data[key];

    const stringParams = stringify(signParams);

    const signHash = crypto
      .createHmac('sha256', this.secret)
      .update(stringParams)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=$/, '');

    if (sign !== signHash) {
      throw new UnauthorizedException('Не совпадает подпись');
    }

    if (
      Date.now() - Number.parseInt(data['vk_ts'] as string) * 1000 >
      TOKEN_LIFETIME
    ) {
      throw new UnauthorizedException('Токен просрочен');
    }

    let user = await this.usersRepository.findOneBy({ vk_user_id });
    let currentTime = getTime()
    if (!user) {
      throw new UnauthorizedException('Чтобы пользоваться этим разделом, вначале станьте агентом');
    } else {
      await this.usersRepository.save({ id: user.id, last_activity: currentTime });
    }

    request.user = user;

    return true;
  }
}
