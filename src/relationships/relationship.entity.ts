import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Relationship {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  company_code: string;

  @Column()
  parent_company: string;
}
