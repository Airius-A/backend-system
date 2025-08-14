import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
