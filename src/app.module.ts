import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

//导入company的模组
import { CompanyModule } from './companies/company.module';
import { Company } from './companies/company.entity';

//导入relationship的模组
import { RelationshipModule } from './relationships/relationship.module';
import { Relationship } from './relationships/relationship.entity';
import { AuthModule } from './auth/auth.module';

// 添加redis缓存模块
import { redisStore } from 'cache-manager-redis-yet';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    // 全局配置模块，确保最先加载
    ConfigModule.forRoot({ isGlobal: true }),

    // Redis 缓存模块
    CacheModule.register({
      store: redisStore,
      host: 'localhost', // Redis 地址
      port: 6379, // Redis 端口
      ttl: 2000, // 默认缓存过期时间
      // isGlobal: true,
    }),

    // 数据库连接
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

    // 业务模块
    UsersModule,
    CompanyModule,
    RelationshipModule,
    AuthModule,
  ],
})
export class AppModule {}
