/**
 * @Author: devilruiniu
 * @Date: 2026-04-11 00:17:41
 * @LastEditors: devilruiniu
 * @LastEditTime: 2026-04-11 10:11:24
 * @Description: todo...
 * @Copyright © 2026 devilruiniu. All Rights Reserved.
 */

import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// 定义客户端的基本信息接口
interface ClientInfo {
  username: string;
}

// 定义一个类，需要实现@nestjs/websockets中的连接成功接口&连接失败接口
// 设置端口8080
@WebSocketGateway(8080, {
  // 设置允许指定域名跨域
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
  // 设置ws接口后的地址
  namespace: '/chat-ws',
})
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients = new Map<string, ClientInfo>();

  // 实现OnGatewayConnection中的接口
  // OnGatewayConnection是一个接口，实现该接口的handleConnection方法会在客户端成功连接到 WebSocket 服务器时被调用。
  // 它提供了一种方便的方式来处理连接建立后的逻辑，比如记录连接的客户端、进行身份验证、发送欢迎消息等。
  handleConnection(@ConnectedSocket() clientWs: Socket) {
    // 告诉客户端已经收到消息，完成握手，并且返回了当前生成的唯一id返回到客户端
    clientWs.emit('connected', clientWs.id);
  }

  // 实现OnGatewayDisconnect的接口
  handleDisconnect(@ConnectedSocket() clientWs: Socket) {
    console.log('🚀 ~ WsGateway ~ handleDisconnect ~ clientWs:', clientWs);
  }

  // 订阅前端的-注册事件
  @SubscribeMessage('register')
  register(@MessageBody() name: string, @ConnectedSocket() clientWs: Socket) {
    // 将该用户于当前的clientWs.id绑定到connectedClients中
    const userId = clientWs.id;
    this.connectedClients.set(userId, {
      username: name,
    });
    // 设置完成之后，告诉客户端注册成功消息
    clientWs.emit('register-success');
  }

  // 订阅前端的-发送消息事件
  @SubscribeMessage('send-message')
  sendMessage(
    @MessageBody() messageData: { userId: string; content: string },
    @ConnectedSocket() clientWs: Socket,
  ) {
    // 将该用户于当前的clientWs.id绑定到connectedClients中
    const userId = messageData.userId;
    const userInfo = this.connectedClients.get(userId);
    // 告诉客户端，我收到了你的消息
    clientWs.emit(
      'message-recepit',
      `收到${userInfo?.username}发送的消息：${messageData.content}`,
    );
    // todo....做其他逻辑处理
    clientWs.emit('message', `我很好`);
  }
}
