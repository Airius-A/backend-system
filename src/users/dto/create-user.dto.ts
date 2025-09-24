import { IsString, IsOptional, IsEnum, IsEmail } from 'class-validator';
import { UserRole, UserStatus } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  role: UserRole; // ⚠️ 改为枚举类型

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus; // 可选字段

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  password?: string;
}
