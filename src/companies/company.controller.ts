import { Controller, Get, Delete } from '@nestjs/common';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('import')
  async importCompanyData() {
    await this.companyService.importCompaniesFromCSV();
    return 'Company data imported!';
  }

  // 删除所有数据库的数值
  @Delete('delete-all')
  async deleteAll() {
    await this.companyService.deleteAllCompanies();
    return { message: 'All companies deleted successfully' };
  }
}
