import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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
}
