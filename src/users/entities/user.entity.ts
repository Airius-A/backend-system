import { Entity, Column, PrimaryColumn, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

// 添加userRole的判定
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

// 添加user的状态管理
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
}

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ unique: true }) // 确保 email 唯一
  email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  company: string;

  @Column()
  password: string;

  @BeforeInsert()
  async generateIdAndHashPassword() {
    if (!this.id) {
      this.id = uuidv4(); // 自动生成 UUID
    }
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10); // 哈希密码
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
