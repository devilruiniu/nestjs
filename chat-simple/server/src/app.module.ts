import { Module } from '@nestjs/common';
import { WsGateway } from './ws.module';

@Module({
  imports: [WsGateway],
  controllers: [],
  providers: [],
})
export class AppModule {}
