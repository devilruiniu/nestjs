/**
 * @Author: devilruiniu
 * @Date: 2026-04-18 22:05:50
 * @LastEditors: devilruiniu
 * @LastEditTime: 2026-04-18 22:33:37
 * @Description: 用户controller
 * @Copyright © 2026 devilruiniu. All Rights Reserved.
 */
import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Get()
  helloUser() {
    return 'hello user';
  }
}
