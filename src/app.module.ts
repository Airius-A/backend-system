import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';

//导入company的模组
import { CompanyModule } from './companies/company.module';
import { Company } from './companies/company.entity';

//导入relationship的模组
import { RelationshipModule } from './relationships/relationship.module';
import { Relationship } from './relationships/relationship.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // 使用 MySQL
      host: 'localhost', // 数据库地址
      port: 3306, // 默认 MySQL 端口
      username: 'AA', // 数据库用户名
      password: 'root123', // 数据库密码
      database: 'crud_user', // 数据库名称
      entities: [User, Company, Relationship], // 需要同步的实体
      synchronize: true, // 开发阶段自动同步实体到数据库（生产环境建议关闭）
    }),
    UsersModule,
    CompanyModule,
    RelationshipModule,
  ],
})
export class AppModule {}
