/**
 * @Author: devilruiniu
 * @Date: 2026-04-18 22:06:17
 * @LastEditors: devilruiniu
 * @LastEditTime: 2026-04-19 14:33:40
 * @Description: UserService层处理增删查改逻辑
 * @Copyright © 2026 devilruiniu. All Rights Reserved.
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  // 注入User Repository
  constructor(
    @InjectRepository(UserEntity)
    private readonly userReop: Repository<UserEntity>,
  ) {}

  // 增加
  async create(data: CreateUserDto) {
    // 创建实体对象
    const user = this.userReop.create(data);
    // 保存入库
    return await this.userReop.save(user);
  }
  // 查找全部数据(需要过滤出已经被删除的数据),
  async findAll() {
    return await this.userReop.find({
      // 0 表示未被删除的数据
      where: { isDeleted: 0 },
    });
  }
  // 根据id查单个数据
  async findById(id: number) {
    return await this.userReop.findOne({
      // 0 表示未被删除的数据
      where: { id, isDeleted: 0 },
    });
  }
  // 修改
  async update(id: number, data: CreateUserDto) {
    // 先查是否存在
    const user = await this.findById(id);
    if (!user) {
      return null;
    }
    const updateUser = this.userReop.merge(user, data);
    return await this.userReop.save(updateUser);
  }
  // 删除
  async remove(id: number) {
    const user = await this.findById(id);
    if (!user) {
      throw new Error('删除用户不存在');
    }
    return await this.userReop.remove(user);
  }
}
