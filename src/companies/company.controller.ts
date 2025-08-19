import {
  Controller,
  Get,
  Delete,
  Body,
  Post,
  Put,
  Param,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import { CompanyFilterDto } from './dto/get-companies-by-filter.dto';

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

  // 增
  @Post()
  async create(@Body() data: Partial<Company>) {
    return this.companyService.createCompany(data);
  }

  // 给 findAll 添加缓存
  @UseInterceptors(CacheInterceptor)
  @CacheKey('company:all')
  // 给缓存限定时间5秒，每隔5秒刷新缓存
  @CacheTTL(5000)
  @Get()
  async findAll() {
    console.log('🔥 数据库查询触发'); // 用于测试缓存是否生效
    return this.companyService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Company> {
    return this.companyService.findOne(id);
  }

  // 改
  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<Company>) {
    return this.companyService.updateCompany(id, data);
  }

  // 删
  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.companyService.deleteCompany(id);
    return { message: 'Company deleted successfully' };
  }

  @Post('filter')
  async getCompaniesByFilter(@Body() filterDto: CompanyFilterDto) {
    return this.companyService.getCompaniesByFilter(filterDto);
  }
}
