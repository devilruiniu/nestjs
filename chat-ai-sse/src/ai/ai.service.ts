/**
 * @Author: devilruiniu
 * @Date: 2026-04-11 17:33:14
 * @LastEditors: devilruiniu
 * @LastEditTime: 2026-04-11 18:34:18
 * @Description: 调用共大模型
 * @Copyright © 2026 devilruiniu. All Rights Reserved.
 */
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor() {
    // 定义openai实例
    this.openai = new OpenAI({
      //用的是阿里云的百炼大模型有免费额度
      apiKey: 'sk-94213f2ee34d48e68f766ee1eb7e5405',
      baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    });
  }

  // async *streamChat = 异步 + 生成器 = 实现打字机效果的流式聊天接口
  // * 星号使用
  // 特点：可以多次返回值，用 yield 而不是 return
  // 可以被 for await...of 遍历
  async *streamChat(
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  ) {
    try {
      // 获取流数据
      // 参考示例：https://help.aliyun.com/zh/model-studio/first-api-call-to-qwen#0604360db33c9
      const stream = await this.openai.chat.completions.create({
        model: 'qvq-max-2025-03-25',
        messages,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      console.error('阿里云大模型-AI服务错误：', error);
      throw new Error('阿里云大模型-AI服务调用失败');
    }
  }
}
