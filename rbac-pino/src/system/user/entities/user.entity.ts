/**
 * @Author: devilruiniu
 * @Date: 2026-04-18 22:07:04
 * @LastEditors: devilruiniu
 * @LastEditTime: 2026-04-19 11:45:41
 * @Description: 创建用户实体类，用来自动生成表格数据
 * @Copyright © 2026 devilruiniu. All Rights Reserved.
 */
import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';
// 用户表实体类
@Entity({
  // 创建的表名称
  name: 'user',
})
// 继承自基础Entity的数据
export class UserEntity extends BaseEntity {
  @Column({
    comment: '用户名称',
    nullable: false,
    type: 'varchar',
  })
  username: string;

  @Column({
    comment: '用户密码',
    nullable: false,
    type: 'varchar',
  })
  password: string;
}
