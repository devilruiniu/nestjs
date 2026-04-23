/**
 * @Author: devilruiniu
 * @Date: 2026-04-19 10:08:54
 * @LastEditors: devilruiniu
 * @LastEditTime: 2026-04-19 15:51:30
 * @Description: todo...
 * @Copyright © 2026 devilruiniu. All Rights Reserved.
 */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import dayjs from 'dayjs';
import { Observable, map } from 'rxjs';
interface StanderResult<T = any> {
  code: number;
  message: string;
  data: T;
}

@Injectable()
export class HttpResultInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<StanderResult<unknown>> {
    // 拦截所有返回的数据
    return next.handle().pipe(
      map((data: unknown) => {
        // 格式化时间
        const formattedData = this.formatDateFields(data);
        return {
          code: 200,
          message: '成功',
          data: formattedData,
        };
      }),
    );
  }
  /**
   * 自动格式化：
   * createTime、updateTime 变成 YYYY-MM-DD HH:mm:ss
   */
  private formatDateFields(data: unknown): unknown {
    // 空数据直接返回
    if (data === null || data === undefined) return data;

    // 对象
    if (typeof data === 'object' && !Array.isArray(data)) {
      const obj = { ...data };

      // 格式化 createTime
      if (
        'createTime' in obj &&
        obj.createTime &&
        typeof obj.createTime === 'object'
      ) {
        obj.createTime = dayjs(obj.createTime as Date).format(
          'YYYY-MM-DD HH:mm:ss',
        );
      }

      // 格式化 updateTime
      if (
        'updateTime' in obj &&
        obj.updateTime &&
        typeof obj.updateTime === 'object'
      ) {
        obj.updateTime = dayjs(obj.updateTime as Date).format(
          'YYYY-MM-DD HH:mm:ss',
        );
      }

      return obj;
    }

    // 数组（列表接口自动循环格式化）
    if (Array.isArray(data)) {
      return data.map((item) => this.formatDateFields(item));
    }
    return data;
  }
}
