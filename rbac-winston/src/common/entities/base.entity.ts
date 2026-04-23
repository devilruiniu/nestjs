import {
  Column,
  ColumnOptions,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// 所有entity都需要继承这个基础实体类
export abstract class BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({
    name: 'create_by',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '创建人',
  } as ColumnOptions)
  createBy: string | null;

  @CreateDateColumn({
    name: 'create_time',
    type: 'datetime',
    nullable: true,
    comment: '创建时间',
  })
  createTime: Date | null;

  @Column({
    name: 'update_by',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '更新人',
  })
  updateBy: string | null;

  @UpdateDateColumn({
    name: 'update_time',
    type: 'datetime',
    nullable: true,
    comment: '更新时间',
  })
  updateTime: Date | null;

  @Column({
    name: 'is_deleted',
    type: 'tinyint',
    default: 0,
    comment: '逻辑删除标识（0-未删除，1-已删除）',
  })
  isDeleted: number;
}
