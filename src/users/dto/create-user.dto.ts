export class CreateUserDto {
  name: string;
  email: string;
  role: string;
  status: string;
  phone_number: string;
  company: string;

  // 新增：密码
  password?: string;
}
