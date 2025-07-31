import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // 使用 MySQL
      host: 'localhost', // 数据库地址
      port: 3306, // 默认 MySQL 端口
      username: 'AA', // 数据库用户名
      password: 'root123', // 数据库密码
      database: 'crud_user', // 数据库名称
      entities: [User], // 需要同步的实体
      synchronize: true, // 开发阶段自动同步实体到数据库（生产环境建议关闭）
    }),
    UsersModule,
  ],
})
export class AppModule {}
