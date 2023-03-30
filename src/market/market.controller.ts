import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@app/core/decorators';
import { UserEntity } from 'src/users/entities';
import { CreateCustomAvatarDto } from './dto';
import { MarketService } from './market.service';
import { ColorsAllEnum } from './enums';

@ApiBearerAuth()
@ApiTags('Маркет')
@Controller('market')
export class MarketController {
  constructor(
    private readonly marketService: MarketService,
    ) {}

  @Post('createCustomAvatar')
  @ApiOperation({ summary: 'Создать кастомную аватарку' })
  async createCustomAvatar(@User() user: UserEntity, @Body() body: CreateCustomAvatarDto) {
    return this.marketService.createCustomAvatar(user, body.color, body.icon_name)
  }

  @Post('installAvatar/:hash')
  @ApiOperation({ summary: 'Установить аватарку' })
  async installAvatar(@User() user: UserEntity, @Param('hash') hash: string) {
    return this.marketService.installAvatar(user, hash)
  }

  @Post('buyColor')
  @ApiOperation({ summary: 'Купить цвет' })
  async buyColor(@User() user: UserEntity, @Body() body) {
    await this.marketService.buyColor(user, body.color)
    return true;
  }

  @Get('getAvalibleColors')
  @ApiOperation({ summary: 'Получить доступные к покупке цвета' })
  async getAvalibleColors() {
    return ColorsAllEnum;
  }

  @Get('getAvalibleIcons')
  @ApiOperation({ summary: 'Получить доступные к покупке иконки' })
  async getAvalibleIcons() {
    return this.marketService.getAvalibleIcons();
  }

  @Post('buyIcon/:iconName')
  @ApiOperation({ summary: 'Получить доступные к покупке иконки' })
  async buyIcon(@User() user: UserEntity, @Param('iconName') iconName: string) {
    await this.marketService.buyIcon(user, iconName)
    return true;
  }


}
