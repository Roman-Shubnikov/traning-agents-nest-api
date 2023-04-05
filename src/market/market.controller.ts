import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@app/core/decorators';
import { UserEntity } from 'src/users/entities';
import { BuyColorDto, CreateCustomAvatarDto, SetNicknameDto } from './dto';
import { MarketService } from './market.service';
import { ColorsAllEnum } from './enums';
import { ConfigService } from '@nestjs/config';

@ApiBearerAuth()
@ApiTags('Маркет')
@Controller('market')
export class MarketController {
  constructor(
    private readonly marketService: MarketService,
    private readonly configService: ConfigService,
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
  async buyColor(@User() user: UserEntity, @Body() body: BuyColorDto) {
    await this.marketService.buyColor(user, body.color)
    return true;
  }

  @Get('getAvalibleColors')
  @ApiOperation({ summary: 'Получить доступные к покупке цвета' })
  async getAvalibleColors() {
    return ColorsAllEnum.map(v => ({ color: v }));
  }

  @Get('getAvalibleIcons')
  @ApiOperation({ summary: 'Получить доступные к покупке иконки' })
  async getAvalibleIcons() {
    return this.marketService.getAvalibleIcons();
  }

  @Post('buyIcon/:iconName')
  @ApiOperation({ summary: 'Купить иконку' })
  async buyIcon(@User() user: UserEntity, @Param('iconName') iconName: string) {
    await this.marketService.buyIcon(user, iconName)
    return true;
  }
  @Get('getMyIcons')
  @ApiOperation({ summary: 'Получить купленные иконки' })
  async getMyIcons(@User() user: UserEntity) {
    return await this.marketService.getMyIcons(user)
  }
  @Get('getMyColors')
  @ApiOperation({ summary: 'Получить купленные цвета' })
  async getMyColors(@User() user: UserEntity) {
    return await this.marketService.getMyColors(user)
  }

  @Get('getPrices')
  @ApiOperation({ summary: 'Получить актуальные цены на товары' })
  async getPrices() {
    const data = {
      nickname: +this.configService.get('MARKET_COST_INSTALL_NEW_NICKNAME'),
      new_avatar: +this.configService.get('MARKET_COST_INSTALL_NEW_AVATAR'),
      new_color: +this.configService.get('MARKET_COST_COLOR'),
      new_icon: +this.configService.get('MARKET_COST_ICON'),
    }
    return data;

  }

  @Put('nickname')
  @ApiOperation({ summary: 'Установить ник' })
  async setNickname(@User() user: UserEntity, @Body() body: SetNicknameDto) {
    await this.marketService.setNickname(user, body.nickname)
    return true;
  }

  @Delete('nickname')
  @ApiOperation({ summary: 'Удалить ник' })
  async deleteNickname(@User() user: UserEntity) {
    await this.marketService.setNickname(user, null)
    return true;
  }


}
