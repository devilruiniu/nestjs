/**
 * @Author: devilruiniu
 * @Date: 2026-04-11 17:16:37
 * @LastEditors: devilruiniu
 * @LastEditTime: 2026-04-11 17:30:36
 * @Description: todo...
 * @Copyright © 2026 devilruiniu. All Rights Reserved.
 */
import { Module } from '@nestjs/common';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
