import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// create user entity
@Entity()
export class User {
  // added primary key for user (id)
  @PrimaryGeneratedColumn()
  id: number;

  // added parameter
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
