import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { Company } from './company.entity';
// add redis module
import { redisStore } from 'cache-manager-ioredis-yet';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: 'localhost', // 改成你的 Redis 地址
            port: 6379,
          },
          ttl: 60, // 默认缓存时间 60s
        }),
      }),
      isGlobal: true, // 是否全局缓存，可选
    }),
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
