/**
 * @Author: devilruiniu
 * @Date: 2026-04-19 12:42:03
 * @LastEditors: devilruiniu
 * @LastEditTime: 2026-04-19 14:51:14
 * @Description: http异常过滤器，针对返回错误做统一处理
 * @Copyright © 2026 devilruiniu. All Rights Reserved.
 */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

// 拦截所有请求异常的数据，代码中throw new Error的异常无法拦截
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionData = exception.getResponse();
    // 处理DTO校验返回的数组信息 ["xxx不能为空","xxx格式错误"]
    let message: unknown;
    if (
      exceptionData &&
      typeof exceptionData === 'object' &&
      'message' in exceptionData
    ) {
      if (Array.isArray(exceptionData.message)) {
        message = exceptionData.message.join(', ');
      } else {
        message = exceptionData.message;
      }
    } else if (typeof exceptionData === 'string') {
      message = exceptionData;
    } else {
      message = 'http->服务器请求异常';
    }
    response.json({
      code: status,
      message: message,
      data: null,
    });
  }
}
