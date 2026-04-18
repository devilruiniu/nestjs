/**
 * @Author: devilruiniu
 * @Date: 2026-04-18 22:07:04
 * @LastEditors: devilruiniu
 * @LastEditTime: 2026-04-18 22:35:54
 * @Description: 创建用户实体类，用来自动生成表格数据
 * @Copyright © 2026 devilruiniu. All Rights Reserved.
 */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// 用户表实体类
@Entity({
  // 创建的表名称
  name: 'user',
})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;
}
