import { IsEnum, IsOptional } from 'class-validator';
import { UserRole, UserStatus } from '../entities/user.entity';

export class UpdateUserRoleDto {
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
