### 开发过程
1. 删除src目录下多余文件,只保留main.ts,app.moudle.ts
2. src目录下创建ws.module.ts服务，并在main.ts中导入
3. 安装项目依赖 `npm i @nestjs/websockets @nestjs/platform-socket.io socket.io`
4. 使用@nestjs/websockets以及socket.io启动websocket服务,服务地址设置为ws://localhots:8080/chat-ws（通过namespace配置）
5. 前端页面发起请求之后，会报跨域问题：
```
http://localhost:8080/socket.io/?EIO=4&transport=polling&t=55k2k5g7' from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

```
6. ws.module.ts中设置允许跨域
```
@WebSocketGateway(8080, {
  // 设置允许指定域名跨域
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
  // 表示接口后的地址
  namespace: '/chat-ws',
})
```