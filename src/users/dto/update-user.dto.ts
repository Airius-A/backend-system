export class UpdateUserDto {
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  phone_number?: string;
  company?: string;

  // 新增：更新时改密码
  password?: string;
}
