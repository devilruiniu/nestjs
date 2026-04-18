/**
 * @Author: devilruiniu
 * @Date: 2026-04-18 10:39:50
 * @LastEditors: devilruiniu
 * @LastEditTime: 2026-04-18 17:33:08
 * @Description: 项目入口文件
 * @Copyright © 2026 devilruiniu. All Rights Reserved.
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
