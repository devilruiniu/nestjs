/**
 * @Author: devilruiniu
 * @Date: 2026-04-19 14:35:40
 * @LastEditors: devilruiniu
 * @LastEditTime: 2026-04-19 15:21:19
 * @Description: 拦截异常请求
 * @Copyright © 2026 devilruiniu. All Rights Reserved.
 */
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

// 拦截所有的Error错误
@Catch(Error)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.json({
      code: 500,
      message: exception.message || '服务器异常，请重试!',
      data: null,
    });
  }
}
