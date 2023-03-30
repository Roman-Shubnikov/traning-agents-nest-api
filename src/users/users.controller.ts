import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles, User } from '@app/core/decorators';
import { RoleEnum } from '@app/core/enums';
import { UserEntity } from 'src/users/entities';
import { UsersService } from 'src/users/users.service';
import { ChangeUserRoleDto } from 'src/users/dto';

@ApiBearerAuth()
@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    ) {}

  @Post('isAdmin')
  @ApiOperation({ summary: 'Узнать администратор или нет' })
  @ApiResponse({ status: HttpStatus.OK })
  async isAdmin(@User() user: UserEntity) {
    return this.usersService.isAdmin(user);
  }

  @Put('role/:id')
  @ApiOperation({ summary: 'Сменить роль пользователя' })
  @Roles(RoleEnum.ADMIN)
  async changeRole(
    @Param('id') id: string,
    @Body() { role }: ChangeUserRoleDto,
  ) {
    return this.usersService.changeRole(+id, role);
  }

  @Get('getSelf')
  @ApiOperation({ summary: 'Получить информацию о себе' })
  async getSelf(@User() user: UserEntity) {
    return this.usersService.getSelf(user);
  }

  @Get('getStaff')
  @ApiOperation({ summary: 'Получить информацию о редакторах сообщества' })
  async getStaff() {
    return this.usersService.getStaff();
  }

  
}
