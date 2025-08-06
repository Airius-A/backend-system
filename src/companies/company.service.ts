import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async importCompaniesFromCSV(): Promise<void> {
    const filePath = path.resolve(__dirname, '../../src/data/companies.csv');
    const results: Company[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          if (Object.values(data).every((value) => value === '')) return;
          const company = this.companyRepository.create({
            company_code: data.company_code,
            company_name: data.company_name,
            level: data.level,
            country: data.country,
            city: data.city,
            founded_year: Number(data.founded_year),
            annual_revenue: Number(data.annual_revenue),
            employees: Number(data.employees),
          });

          results.push(company);
        })
        .on('end', async () => {
          await this.companyRepository.save(results);
          resolve();
        })
        .on('error', reject);
    });
  }

  async deleteAllCompanies(): Promise<void> {
    await this.companyRepository.clear(); // 清空整个表的数据
  }
}
