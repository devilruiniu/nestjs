import { IsNotEmpty, IsString, Length } from 'class-validator';

/**
 * @Author: devilruiniu
 * @Date: 2026-04-19 11:57:40
 * @LastEditors: devilruiniu
 * @LastEditTime: 2026-04-19 12:27:57
 * @Description: 创建用户数据的DTO（用来校验数据的输入需要满足定义的规则）
 * @Copyright © 2026 devilruiniu. All Rights Reserved.
 */
export class CreateUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须是字符串' })
  @Length(3, 20, { message: '用户名长度必须在3-20位之间' })
  username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须是字符串' })
  password: string;
}
