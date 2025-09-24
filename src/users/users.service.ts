import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto'; // 新增的 DTO
import { UpdateUserRoleDto } from './dto/update-user-role.dto'; // 新增的 DTO
import { UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 创建用户
  async create(dto: CreateUserDto): Promise<User> {
    // dto 里直接传明文密码，entity 会在 @BeforeInsert 自动哈希
    const newUser = this.userRepository.create(dto);
    return await this.userRepository.save(newUser);
  }

  // 查询全部
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  // 查询单个（UUID 改成 string）
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }
    return user;
  }

  // 更新（需要注意密码如果传了要重新哈希）
  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // 如果更新了密码，要重新哈希
    if (dto.password) {
      const bcrypt = await import('bcrypt');
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    await this.userRepository.update(id, dto);
    return this.findOne(id);
  }

  // 用户更新个人资料（只能更新密码和电话）
  async updateProfile(
    id: string,
    dto: UpdateProfileDto,
    currentUser: any,
  ): Promise<User> {
    console.log('Current user object:', currentUser);

    // 使用 sub 字段来获取用户ID（JWT标准中使用sub作为subject标识）
    const currentUserId = currentUser.userId;

    if (!currentUserId) {
      console.log('❌ User ID not found in token');
      throw new ForbiddenException('User information is incomplete');
    }

    if (currentUserId !== id) {
      console.log('❌ Permission denied: ID mismatch', {
        currentUserId,
        targetId: id,
      });
      throw new ForbiddenException('You can only update your own profile');
    }

    // 验证当前用户是普通用户（USER）
    if (currentUser.role !== UserRole.USER) {
      console.log('Permission denied: role is not USER', {
        role: currentUser.role,
      });
      throw new ForbiddenException('This endpoint is only for regular users');
    }

    // 构建只包含允许更新的字段的对象
    const updateData: Partial<User> = {};

    if (dto.password) {
      // 哈希密码
      const bcrypt = await import('bcrypt');
      updateData.password = await bcrypt.hash(dto.password, 10);
    }

    if (dto.phone_number) {
      updateData.phone_number = dto.phone_number;
    }

    // 如果没有提供任何可更新的字段
    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException('No valid fields provided for update');
    }

    // 更新数据库
    await this.userRepository.update(id, updateData);

    // 返回更新后的用户信息（排除密码）
    const updatedUser = await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.email',
        'user.role',
        'user.status',
        'user.phone_number',
        'user.company',
      ])
      .where('user.id = :id', { id })
      .getOne();

    if (!updatedUser) {
      throw new NotFoundException('User not found after update');
    }

    return updatedUser;
  }

  // 管理员更新用户角色和状态
  async updateUserRoleAndStatus(
    id: string,
    dto: UpdateUserRoleDto,
  ): Promise<User> {
    const user = await this.findOne(id);

    // 构建更新数据
    const updateData: Partial<User> = {};

    if (dto.role) {
      updateData.role = dto.role;
    }

    if (dto.status) {
      updateData.status = dto.status;
    }

    // 如果没有提供任何可更新的字段
    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException('No valid fields provided for update');
    }

    // 更新数据库
    await this.userRepository.update(id, updateData);

    // 返回更新后的用户信息（排除密码）
    const updatedUser = await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.email',
        'user.role',
        'user.status',
        'user.phone_number',
        'user.company',
      ])
      .where('user.id = :id', { id })
      .getOne();

    if (!updatedUser) {
      throw new NotFoundException('User not found after update');
    }

    return updatedUser;
  }

  // 删除
  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }
}
