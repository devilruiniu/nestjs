/**
 * @Author: devilruiniu
 * @Date: 2026-04-18 10:39:50
 * @LastEditors: devilruiniu
 * @LastEditTime: 2026-04-18 22:37:22
 * @Description: app入口文件
 * @Copyright © 2026 devilruiniu. All Rights Reserved.
 */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import mysqlConfigSchema from './common/validation/mysql.validation';
import typeormConfig from './config/typeorm.config';
import { UserModule } from './system/user/user.module';

const envPath = `.env.${process.env.NODE_ENV || 'dev'}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // 环境变量文件路径：后面的配置会合并前面文件的配置
      envFilePath: ['.env', envPath],
      // 将对应配置文件加载到ConfigModule中
      load: [typeormConfig],
      // 添加【mysql】的必填校验规则
      validate: (config) => {
        const mysqlValidation = mysqlConfigSchema.validate(config, {
          allowUnknown: true,
        });
        // 校验mysql配置是否满足Schema要求
        if (mysqlValidation.error) {
          throw new Error(
            `mysql config validation error：${mysqlValidation.error}`,
          );
        }
        // 校验其他配置项
        return config;
      },
    }),
    // 连接数据库的typeOrm配置
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        // 获取mysql配置，并完成测试连接数据库是否能够成功
        return {
          ...(await config.get('typeorm')),
          // 是否自动创建表
          synchronize: process.env.NODE_ENV !== 'prod',
          // 是否自动加载所有的entity
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
    // 加载User模块
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
