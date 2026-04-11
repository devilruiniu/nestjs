/**
 * @Author: devilruiniu
 * @Date: 2026-04-11 17:16:37
 * @LastEditors: devilruiniu
 * @LastEditTime: 2026-04-11 17:30:13
 * @Description: 项目入口文件
 * @Copyright © 2026 devilruiniu. All Rights Reserved.
 */
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  // 使用NestExpressApplication方式创建app，因为后面的useStaticAssets是express中的方法
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // useStaticAssets 是 NestJS (Express 版) 中，用于让服务器直接提供静态文件（图片、CSS、JS、上传文件等）的核心方法。
  app.useStaticAssets(join(__dirname, '..', 'public'));
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
