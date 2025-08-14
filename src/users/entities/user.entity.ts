import { Entity, Column, PrimaryColumn, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  role: string;

  @Column()
  status: string;

  @Column()
  phone_number: string;

  @Column()
  company: string;

  @Column()
  password: string;

  @BeforeInsert()
  async generateIdAndHashPassword() {
    if (!this.id) {
      this.id = uuidv4(); // 防止 id 为空
    }
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
