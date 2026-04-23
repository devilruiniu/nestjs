/**
 * @Author: devilruiniu
 * @Date: 2026-04-18 22:05:50
 * @LastEditors: devilruiniu
 * @LastEditTime: 2026-04-19 12:25:22
 * @Description: 用户controller
 * @Copyright © 2026 devilruiniu. All Rights Reserved.
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // 新增,username和password必填
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }
  // 查全部
  @Get()
  findAll() {
    return this.userService.findAll();
  }
  // 根据id查单个
  @Get(':id')
  findById(@Param('id') id: number) {
    return this.userService.findById(id);
  }
  // 修改, 所有数据都时可选的更新
  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: CreateUserDto) {
    return this.userService.update(id, dto);
  }
  // 删除
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
