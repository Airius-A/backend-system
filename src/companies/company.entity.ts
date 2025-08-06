import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  company_code: string;

  @Column()
  company_name: string;

  @Column()
  level: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column({ type: 'int' })
  founded_year: number;

  @Column({ type: 'float' })
  annual_revenue: number;

  @Column({ type: 'int' })
  employees: number;
}
