/**
 * @Author: devilruiniu
 * @Date: 2026-04-18 22:05:28
 * @LastEditors: devilruiniu
 * @LastEditTime: 2026-04-18 22:38:06
 * @Description: 用户模块
 * @Copyright © 2026 devilruiniu. All Rights Reserved.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
@Module({
  // 注册User实体 Repository
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
