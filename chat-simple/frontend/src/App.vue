/**
* @Author: devilruiniu
* @Date: 2026-04-11 00:07:24
* @LastEditors: devilruiniu
* @LastEditTime: 2026-04-11 10:24:42
* @Description: todo...
* @Copyright © 2026 devilruiniu. All Rights Reserved.
*/
<script setup>
import socketIo from 'socket.io-client';
import { onMounted, reactive } from 'vue';
const state = reactive({
  socket: null,
  socketStatusText: '未连接',
  userId: null,
  registerStatusText: '未注册',
  username: 'devilruiniu',
  messageText: '',
  messageRecepitText: '',
  messageResult: '',
})
onMounted(() => {
  // 连接ws
  state.socket = socketIo("ws://localhost:8080/chat-ws")
  // 监听后台发送过来的-连接成功事件
  state.socket.on('connected', (socketId) => {
    console.log("🚀 ~ socketId:", socketId)
    state.socketStatusText = '连接成功！'
    state.userId = socketId
  })
  // 监听后台发送过来的-注册成功事件
  state.socket.on('register-success', () => {
    state.registerStatusText = `${state.username}注册成功!`
  })
  // 监听后台发送过来的-收到消息回执事件
  state.socket.on('message-recepit', (message) => {
    state.messageRecepitText = message
  })
  // 监听后台发送过来的-消息事件
  state.socket.on('message', (message) => {
    state.messageResult = message
  })
})
const handleClose = () => {
  state.socketStatusText = '未连接!'
  state.socket && state.socket.close()
}
// 点击注册用户，将用户注册到后台中，需要触发register事件
const handleRegister = () => {
  // 触发后台的register事件
  state.socket.emit('register', state.username)
}

// 发送消息
const handleSendMessage = () => {
  state.messageText = `你好`
  // 触发后台的收到消息事件
  state.socket.emit('send-message', {
    userId: state.userId,
    content: state.messageText
  })
}

</script>

<template>
  <div>chat 聊天页面</div>
  <div>
    <span>【注册状态】：{{ state.registerStatusText }}</span>
    <button @click="handleRegister">注册用户{{ state.username }}</button>
  </div>
  <div>
    <span>【ws连接状态】：{{ state.socketStatusText }}</span>
    <button @click="handleClose">断开连接</button>
  </div>
  <div>
    <div>【发送消息】：{{ state.messageText }}</div>
    <div>【消息回执】：{{ state.messageRecepitText }}</div>
    <div>【后台回复】：{{ state.messageResult }}</div>
    <button @click="handleSendMessage">发送消息</button>
  </div>
</template>
