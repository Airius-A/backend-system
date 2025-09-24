// users.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Put,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto'; // 新增的 DTO
import { UpdateUserRoleDto } from './dto/update-user-role.dto'; // 新增的 DTO
import { Public } from './roles.decorator'; // 导入公开装饰器
import { UserRole } from './entities/user.entity';
import { Roles } from './roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public() // 标记为公开路由，不需要认证
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // 其他路由保持需要认证
  @Get()
  @Roles(UserRole.ADMIN) // 只有 ADMIN 角色可以访问
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN) // 只有 ADMIN 角色可以访问
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // 新增的用户个人资料更新接口（USER 使用）
  @Put('profile/:id')
  @Roles(UserRole.USER)
  updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @Req() req: Request,
  ) {
    const user = (req as any).user; // 使用类型断言
    return this.usersService.updateProfile(id, updateProfileDto, user);
  }

  // 新增的管理员接口：修改用户角色和状态
  @Put('admin/:id/update-status')
  @Roles(UserRole.ADMIN) // 只有管理员可以访问
  updateUserRoleAndStatus(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    return this.usersService.updateUserRoleAndStatus(id, updateUserRoleDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN) // 只有 ADMIN 角色可以访问
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
