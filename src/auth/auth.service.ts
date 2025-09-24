import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // 验证用户邮箱 + 密码
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      // 不返回密码
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // 登录并签发 JWT
  async login(user: any) {
    // ⚠️ 这里一定要把 role 放进去
    const payload = {
      sub: user.id,
      username: user.name,
      email: user.email,
      role: user.role, // 添加角色
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // 可选：注册用户
  async register(userDto: any) {
    const user = await this.usersService.create(userDto);
    return this.login(user); // 注册后直接登录并返回 token
  }
}
