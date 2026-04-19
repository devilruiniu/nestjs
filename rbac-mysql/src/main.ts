/**
 * @Author: devilruiniu
 * @Date: 2026-04-18 10:39:50
 * @LastEditors: devilruiniu
 * @LastEditTime: 2026-04-19 15:39:51
 * @Description: 项目入口文件
 * @Copyright © 2026 devilruiniu. All Rights Reserved.
 */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorExceptionFilter } from './common/filter/error-exception.filter';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { HttpResultInterceptor } from './common/interceptor/httpResult.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 全局开启 DTO 校验（所有接口自动校验）, 才会拦截dto校验的异常数据
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 只接收 DTO 定义的字段，多余字段自动删掉
      transform: true, // 自动把入参转成 DTO 对象
      forbidNonWhitelisted: false, // 设为 true 会直接拒绝多余字段
    }),
  );
  // 添加全局拦截器
  // HttpResultInterceptor是http请求成功的拦截器，用来统一所有的http请求成功的返回内容
  app.useGlobalInterceptors(...[new HttpResultInterceptor()]);
  // 添加全局过滤器
  // ErrorExceptionFilter是全局的Error异常请求拦截，拦截规则是从右往左（从数组后面往前拦截的），一定要注意顺序！！
  // HttpExceptionFilter是http请求失败的过滤器，用来统一所有的http请求失败的返回内容
  app.useGlobalFilters(
    ...[new ErrorExceptionFilter(), new HttpExceptionFilter()],
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
