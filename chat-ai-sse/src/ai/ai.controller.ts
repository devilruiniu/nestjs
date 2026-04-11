/**
 * @Author: devilruiniu
 * @Date: 2026-04-11 17:33:04
 * @LastEditors: devilruiniu
 * @LastEditTime: 2026-04-11 19:38:08
 * @Description: todo...
 * @Copyright © 2026 devilruiniu. All Rights Reserved.
 */
import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AiService } from './ai.service';

interface ChatData {
  // 用户发送的消息内容
  message: string;
  // 系统提示词
  systemPromt?: string;
}
@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}
  @Post('chat/stream-sse')
  async streamChatSSE(@Body() body: ChatData, @Res() res: Response) {
    // 获取需要传递给ai的数据
    const messages = [
      {
        role: 'system' as const,
        content: body.systemPromt || '你是一个专业的聊天机器人',
      },
      { role: 'user' as const, content: body.message },
    ];
    try {
      // 需要设置相应数据为流式，所以，这里要引入express的Response类型
      // 设置SSE响应头
      res.setHeader('Content-Type', 'text/event-stream');
      // 设置连接成功返回-让前端之后该大模型已经开始处理流程了
      res.write('data: {"type": "start"}\n\n');
      // 流式返回数据
      for await (const chunk of this.aiService.streamChat(messages)) {
        const data = JSON.stringify({ type: 'chunk', content: chunk });
        res.write(`data: ${data}\n\n`);
      }
      // 发送结束信号-让前端可以知道改流程已结束
      res.write('data: {"type": "end"}\n\n');
      res.end();
    } catch (err: unknown) {
      // 先判断 err 是不是标准错误对象
      // 安全判断
      if (err instanceof Error) {
        const message = err instanceof Error ? err.message : '未知错误';
        console.error('SSE流式聊天错误：', err);
        const errorData = JSON.stringify({
          type: 'error',
          error: '服务器内部错误',
          message,
        });
        res.write(`data: ${errorData}\n\n`);
        res.end();
      } else {
        console.log('未知错误');
      }
    }
  }
}
