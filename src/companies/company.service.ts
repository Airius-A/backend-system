import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { NotFoundException } from '@nestjs/common';
import { CompanyFilterDto } from './dto/get-companies-by-filter.dto';

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

  async createCompany(data: Partial<Company>): Promise<Company> {
    const company = this.companyRepository.create(data);
    return this.companyRepository.save(company);
  }

  async findAll(): Promise<Company[]> {
    return this.companyRepository.find();
  }

  async findOne(id: number): Promise<Company> {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }

  async updateCompany(id: number, data: Partial<Company>): Promise<Company> {
    await this.companyRepository.update(id, data);
    const updated = await this.companyRepository.findOneBy({ id });

    if (!updated) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return updated;
  }

  async deleteCompany(id: number): Promise<void> {
    await this.companyRepository.delete(id);
  }

  // 进阶版检索
  async getCompaniesByFilter(filterDto: CompanyFilterDto): Promise<any> {
    const { dimension, filter } = filterDto;

    const query = this.companyRepository.createQueryBuilder('company');

    // 动态拼接 WHERE 条件
    if (filter.level?.length) {
      query.andWhere('company.level IN (:...levels)', { levels: filter.level });
    }

    if (filter.country?.length) {
      query.andWhere('company.country IN (:...countries)', {
        countries: filter.country,
      });
    }

    if (filter.city?.length) {
      query.andWhere('company.city IN (:...cities)', { cities: filter.city });
    }

    if (
      filter.founded_year?.start !== undefined &&
      filter.founded_year?.end !== undefined
    ) {
      query.andWhere('company.founded_year BETWEEN :start AND :end', {
        start: filter.founded_year.start,
        end: filter.founded_year.end,
      });
    }

    if (
      filter.annual_revenue?.min !== undefined &&
      filter.annual_revenue?.max !== undefined
    ) {
      query.andWhere('company.annual_revenue BETWEEN :minRev AND :maxRev', {
        minRev: filter.annual_revenue.min,
        maxRev: filter.annual_revenue.max,
      });
    }

    if (
      filter.employees?.min !== undefined &&
      filter.employees?.max !== undefined
    ) {
      query.andWhere('company.employees BETWEEN :minEmp AND :maxEmp', {
        minEmp: filter.employees.min,
        maxEmp: filter.employees.max,
      });
    }

    // 获取所有符合条件的数据
    const companies = await query.getMany();

    // 分组逻辑
    const groupedData = {};
    for (const company of companies) {
      const key = company[dimension];
      if (!groupedData[key]) {
        groupedData[key] = [];
      }
      groupedData[key].push(company);
    }

    return {
      dimension,
      data: groupedData,
      filter, // 可选返回，便于前端复用
    };
  }
}
