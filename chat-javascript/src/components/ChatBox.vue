<template>
  <div class="chat-box" :class="{ 'dark-theme': isDarkTheme }">
    <div class="chat-header">
      <h2>聊天窗口</h2>
      <a-button @click="toggleTheme" type="primary" ghost>
        {{ isDarkTheme ? '切换到浅色模式' : '切换到深色模式' }}
      </a-button>
    </div>
    <div ref="messagesContainer" class="chat-messages" @scroll="handleScroll">
      <!-- 虚拟滚动 -->
      <div class="virtual-scroll-container" :style="{
        height: totalHeight + 'px',
        position: 'relative'
      }">
        <div class="virtual-scroll-content" :style="{
          transform: `translateY(${startOffset}px)`,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0
        }">
          <div v-for="(message, index) in visibleMessages" :key="index" class="message" :class="{
            'customer-message': message.sender === 'customer',
            'service-message': message.sender === 'service',
            'bot-message': message.sender === 'bot'
          }" @load="measureMessageHeight(index)">
            <div class="message-avatar">
              <img :src="message.avatar" alt="avatar" />
            </div>
            <div class="message-content">
              <div class="message-sender">{{ message.senderName }}</div>
              <div class="message-text" v-if="message.type === 'markdown'" v-html="parseMarkdown(message.content)">
              </div>
              <div class="message-text" v-else-if="message.type === 'html'" v-html="message.content"></div>
              <div class="message-text" v-else>{{ message.content }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="chat-input">
      <a-input v-model:value="inputValue" placeholder="请输入消息..." @keyup.enter="sendMessage" />
      <a-button type="primary" @click="sendMessage">发送</a-button>
    </div>
    <div v-if="unreadCount > 0" class="unread-badge" @click="scrollToBottom">
      {{ unreadCount }} 条新消息
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

const isDarkTheme = ref(false)
const inputValue = ref('')
const messages = ref([])
const messagesContainer = ref(null)
const unreadCount = ref(0)
const isAutoScroll = ref(true)

// 虚拟滚动相关
const messageHeights = ref([]) // 存储每条消息的高度
const containerHeight = ref(0) // 容器高度
const scrollTop = ref(0) // 滚动位置
const itemHeight = 80 // 预估每条消息的高度

// 计算总高度
const totalHeight = computed(() => {
  if (messageHeights.value.length === 0) {
    return messages.value.length * itemHeight
  }
  // 确保messageHeights数组长度与messages数组长度一致
  const heights = []
  for (let i = 0; i < messages.value.length; i++) {
    heights.push(messageHeights.value[i] || itemHeight)
  }
  return heights.reduce((sum, height) => sum + height, 0)
})

// 计算可见消息的起始索引
const startIndex = computed(() => {
  if (messageHeights.value.length === 0) {
    return Math.max(0, Math.floor(scrollTop.value / itemHeight) - 5)
  }
  let sum = 0
  for (let i = 0; i < messages.value.length; i++) {
    const height = messageHeights.value[i] || itemHeight
    if (sum > scrollTop.value) {
      return Math.max(0, i - 5)
    }
    sum += height
  }
  return Math.max(0, messages.value.length - 10)
})

// 计算可见消息的结束索引
const endIndex = computed(() => {
  if (messageHeights.value.length === 0) {
    return Math.min(messages.value.length, Math.ceil((scrollTop.value + containerHeight.value) / itemHeight) + 5)
  }
  let sum = 0
  for (let i = startIndex.value; i < messages.value.length; i++) {
    const height = messageHeights.value[i] || itemHeight
    sum += height
    if (sum > scrollTop.value + containerHeight.value) {
      return Math.min(messages.value.length, i + 5)
    }
  }
  return messages.value.length
})

// 计算可见消息
const visibleMessages = computed(() => {
  return messages.value.slice(startIndex.value, endIndex.value)
})

// 计算起始偏移量
const startOffset = computed(() => {
  if (messageHeights.value.length === 0) {
    return startIndex.value * itemHeight
  }
  let sum = 0
  for (let i = 0; i < startIndex.value; i++) {
    sum += messageHeights.value[i] || itemHeight
  }
  return sum
})

// 测量消息高度
const measureMessageHeight = (index) => {
  nextTick(() => {
    const messageElement = messagesContainer.value.querySelector(`.message:nth-child(${index - startIndex.value + 1})`)
    if (messageElement) {
      messageHeights.value[index] = messageElement.offsetHeight
    }
  })
}

// 监听消息变化，确保messageHeights数组长度与messages数组长度一致
watch(() => messages.value.length, (newLength) => {
  if (messageHeights.value.length < newLength) {
    // 为新消息初始化高度
    for (let i = messageHeights.value.length; i < newLength; i++) {
      messageHeights.value[i] = itemHeight
    }
  } else if (messageHeights.value.length > newLength) {
    // 移除多余的高度记录
    messageHeights.value = messageHeights.value.slice(0, newLength)
  }
})

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value
}

const parseMarkdown = (content) => {
  return md.render(content)
}

const scrollToBottom = () => {
  nextTick(() => {
    // 添加一个小延迟，确保所有元素都已渲染完成
    setTimeout(() => {
      if (messagesContainer.value) {
        // 滚动到底部，添加一个小的偏移量以确保完全滚动到底
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight + 100
        unreadCount.value = 0
        isAutoScroll.value = true

        // 强制更新messageHeights数组，确保最后一条消息的高度被正确计算
        setTimeout(() => {
          const lastIndex = messages.value.length - 1
          measureMessageHeight(lastIndex)
        }, 50)
      }
    }, 100)
  })
}

const handleScroll = () => {
  if (messagesContainer.value) {
    const { scrollTop: st, scrollHeight, clientHeight } = messagesContainer.value
    scrollTop.value = st
    // 当滚动距离小于总高度减去可视高度的90%时，认为用户在往上滚动
    isAutoScroll.value = st >= scrollHeight - clientHeight - 20
    if (isAutoScroll.value) {
      unreadCount.value = 0
    }
  }
}

// 处理打车卡片按钮点击
const handleTaxiCardAction = (action, taxiId) => {
  inputValue.value = action
  sendMessage(action)
}

// 将函数暴露到window对象，以便在HTML中调用
window.handleTaxiCardAction = handleTaxiCardAction

const sendMessage = () => {
  if (inputValue.value.trim()) {
    // 添加客服消息
    messages.value.push({
      sender: 'service',
      senderName: '客服',
      content: inputValue.value,
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=customer%20service%20avatar&image_size=square',
      type: 'text'
    })

    if (isAutoScroll.value) {
      scrollToBottom()
    }

    // 模拟机器人回复（只在客服手动输入时回复）
    setTimeout(() => {
      // 随机选择回复类型：markdown、html银行卡或html打车卡片
      const replyTypes = ['markdown', 'html', 'taxi']
      const replyType = replyTypes[Math.floor(Math.random() * replyTypes.length)]

      let replyContent
      let replyTypeValue

      if (replyType === 'html') {
        // HTML卡片形式：银行卡模板
        replyContent = `
          <div class="bank-card">
            <div class="bank-card-header">
              <div class="bank-name">示例银行</div>
              <div class="card-type">信用卡</div>
            </div>
            <div class="bank-card-body">
              <div class="card-number">**** **** **** 1234</div>
              <div class="card-holder">持卡人: 张三</div>
              <div class="card-expiry">有效期: 2026/12</div>
            </div>
            <div class="bank-card-footer">
              <div class="card-logo">示例银行</div>
            </div>
          </div>
        `
        replyTypeValue = 'html'
      } else if (replyType === 'taxi') {
        // HTML卡片形式：打车模板
        const taxiInfo = {
          from: '北京市朝阳区望京SOHO',
          to: '北京市海淀区中关村',
          plateNumber: '京A12345',
          carModel: '大众帕萨特'
        }
        // 为taxiInfo添加唯一标识
        const taxiId = Date.now()
        // 存储taxiInfo到全局对象，以便后续访问
        window.taxiOrders = window.taxiOrders || {}
        window.taxiOrders[taxiId] = taxiInfo
        replyContent = `
          <div class="taxi-card">
            <div class="taxi-card-header">
              <div class="taxi-title">打车订单</div>
            </div>
            <div class="taxi-card-body">
              <div class="taxi-route">
                <div class="route-item">
                  <div class="route-icon">📍</div>
                  <div class="route-text">${taxiInfo.from}</div>
                </div>
                <div class="route-arrow">↓</div>
                <div class="route-item">
                  <div class="route-icon">📍</div>
                  <div class="route-text">${taxiInfo.to}</div>
                </div>
              </div>
              <div class="taxi-info">
                <div class="info-item">
                  <span class="info-label">车牌号码:</span>
                  <span class="info-value">${taxiInfo.plateNumber}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">车型:</span>
                  <span class="info-value">${taxiInfo.carModel}</span>
                </div>
              </div>
            </div>
            <div class="taxi-card-footer">
              <button class="taxi-btn cancel-btn" onclick="window.handleTaxiCardAction('取消打车', ${taxiId})">取消打车</button>
              <button class="taxi-btn confirm-btn" onclick="window.handleTaxiCardAction('确定订单', ${taxiId})">确定订单</button>
            </div>
          </div>
        `
        replyTypeValue = 'html'
      } else {
        // Markdown形式
        replyContent = `您发送了: ${inputValue.value}\n\n**这是一个markdown回复**\n- 列表项1\n- 列表项2`
        replyTypeValue = 'markdown'
      }

      messages.value.push({
        sender: 'bot',
        senderName: '机器人',
        content: replyContent,
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=robot%20avatar&image_size=square',
        type: replyTypeValue
      })

      if (isAutoScroll.value) {
        scrollToBottom()
      } else if (messages[messages.length - 1].sender === 'customer') {
        unreadCount.value++
      }
    }, 1000)

    inputValue.value = ''
  }
}

// 模拟客服回复
const simulateServiceReply = () => {
  const serviceReplies = [
    '您好，很高兴为您服务',
    '请问有什么可以帮助您的？',
    '好的，我明白了，让我为您解答',
    '感谢您的咨询',
    '如果还有其他问题，请随时告诉我'
  ]

  const randomReply = serviceReplies[Math.floor(Math.random() * serviceReplies.length)]
  messages.value.push({
    sender: 'service',
    senderName: '客服',
    content: randomReply,
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=customer%20service%20avatar&image_size=square',
    type: 'text'
  })

  if (isAutoScroll.value) {
    scrollToBottom()
  }

  // 客服自动回复，不需要机器人回复
}

// 模拟客户消息
const simulateCustomerMessage = () => {
  const customerMessages = [
    '你好，我有一个问题',
    '这个产品怎么使用？',
    '能给我一些建议吗？',
    '谢谢，我明白了',
    '再见'
  ]

  const randomMessage = customerMessages[Math.floor(Math.random() * customerMessages.length)]
  messages.value.push({
    sender: 'customer',
    senderName: '客户',
    content: randomMessage,
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=customer%20avatar&image_size=square',
    type: 'text'
  })

  if (isAutoScroll.value) {
    scrollToBottom()
  } else {
    unreadCount.value++
  }

  // 客户消息后，客服自动回复
  setTimeout(simulateServiceReply, 1500)
}

// 监听消息变化
watch(() => messages.value.length, () => {
  if (isAutoScroll.value) {
    scrollToBottom()
  }
})

onMounted(() => {
  // 初始化容器高度
  if (messagesContainer.value) {
    containerHeight.value = messagesContainer.value.clientHeight
  }

  // 初始化消息
  messages.value = [
    {
      sender: 'bot',
      senderName: '机器人',
      content: '欢迎来到客服中心，有什么可以帮助您的？',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=robot%20avatar&image_size=square',
      type: 'text'
    }
  ]

  // 滚动到底部
  scrollToBottom()

  // 每5秒模消息
  setInterval(simulateCustomerMessage, 5000)
})
</script>

<style scoped>
.chat-box {
  width: 100%;
  max-width: 800px;
  height: 600px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
  color: #333;
  position: relative;
}

.chat-box.dark-theme {
  background-color: #1f1f1f;
  border-color: #434343;
  color: #fff;
}

.chat-header {
  padding: 16px;
  border-bottom: 1px solid #d9d9d9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-box.dark-theme .chat-header {
  border-bottom-color: #434343;
}

.chat-header h2 {
  margin: 0;
  font-size: 16px;
}

.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.customer-message,
.bot-message {
  align-self: flex-start;
}

.customer-message .message-text,
.bot-message .message-text {
  text-align: left;
}

.service-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.service-message .message-text {
  text-align: left;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.message-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-content {
  max-width: 70%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.service-message .message-content {
  align-items: flex-end;
}

.message-sender {
  font-size: 12px;
  color: #8c8c8c;
  text-align: left;
}

.chat-box.dark-theme .message-sender {
  color: #a0a0a0;
}

.message-text {
  padding: 12px;
  border-radius: 8px;
  background-color: #f5f5f5;
  word-wrap: break-word;
  color: #333;
}

.chat-box.dark-theme .message-text {
  background-color: #2c2c2c;
  color: #fff;
}

.service-message .message-text {
  background-color: #1890ff;
  color: white;
}

.bot-message .message-text {
  background-color: #e6f7ff;
  color: #333;
}

.chat-box.dark-theme .bot-message .message-text {
  background-color: #1a365d;
  color: #fff;
}

.chat-input {
  padding: 16px;
  border-top: 1px solid #d9d9d9;
  display: flex;
  gap: 12px;
}

.chat-box.dark-theme .chat-input {
  border-top-color: #434343;
}

.chat-input .a-input {
  flex: 1;
}

/* 未读消息徽章 */
.unread-badge {
  position: absolute;
  bottom: 80px;
  right: 20px;
  background-color: #ff4d4f;
  color: white;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  transition: all 0.3s;
}

.unread-badge:hover {
  background-color: #ff7875;
  transform: translateY(-2px);
}

.chat-box.dark-theme .unread-badge {
  background-color: #ff7875;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.chat-box.dark-theme .unread-badge:hover {
  background-color: #ff4d4f;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .chat-box {
    height: 100vh;
    border-radius: 0;
    border: none;
  }

  .message-content {
    max-width: 80%;
  }
}

/* Markdown样式 */
:deep(.message-text h1) {
  font-size: 18px;
  margin: 10px 0;
}

:deep(.message-text h2) {
  font-size: 16px;
  margin: 8px 0;
}

:deep(.message-text p) {
  margin: 4px 0;
}

:deep(.message-text ul) {
  margin: 4px 0;
  padding-left: 20px;
}

:deep(.message-text li) {
  margin: 2px 0;
}

:deep(.message-text strong) {
  font-weight: bold;
}

/* 银行卡样式 */
:deep(.bank-card) {
  width: 100%;
  height: 180px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 20px;
  color: white;
  font-family: Arial, sans-serif;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

:deep(.bank-card::before) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.05);
  z-index: 1;
}

:deep(.bank-card-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  position: relative;
  z-index: 2;
}

:deep(.bank-name) {
  font-size: 18px;
  font-weight: bold;
}

:deep(.card-type) {
  font-size: 14px;
  opacity: 0.8;
}

:deep(.bank-card-body) {
  position: relative;
  z-index: 2;
}

:deep(.card-number) {
  font-size: 18px;
  letter-spacing: 2px;
  margin-bottom: 20px;
  font-family: 'Courier New', monospace;
}

:deep(.card-holder) {
  font-size: 14px;
  margin-bottom: 10px;
}

:deep(.card-expiry) {
  font-size: 14px;
}

:deep(.bank-card-footer) {
  position: absolute;
  bottom: 20px;
  right: 20px;
  font-size: 12px;
  opacity: 0.8;
  z-index: 2;
}

:deep(.card-logo) {
  font-weight: bold;
}

/* 打车卡片样式 */
:deep(.taxi-card) {
  width: 100%;
  background: white;
  border-radius: 12px;
  padding: 20px;
  color: #333;
  font-family: Arial, sans-serif;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid #e8e8e8;
}

.chat-box.dark-theme :deep(.taxi-card) {
  background: #2c2c2c;
  color: #fff;
  border-color: #434343;
}

:deep(.taxi-card-header) {
  margin-bottom: 15px;
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 10px;
}

.chat-box.dark-theme :deep(.taxi-card-header) {
  border-bottom-color: #434343;
}

:deep(.taxi-title) {
  font-size: 16px;
  font-weight: bold;
}

:deep(.taxi-card-body) {
  margin-bottom: 20px;
}

:deep(.taxi-route) {
  margin-bottom: 15px;
}

:deep(.route-item) {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
}

:deep(.route-icon) {
  font-size: 16px;
  flex-shrink: 0;
}

:deep(.route-text) {
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
}

:deep(.route-arrow) {
  margin-left: 20px;
  margin-bottom: 10px;
  color: #1890ff;
}

:deep(.taxi-info) {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 8px;
}

.chat-box.dark-theme :deep(.taxi-info) {
  background: #3a3a3a;
}

:deep(.info-item) {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 14px;
}

:deep(.info-label) {
  color: #8c8c8c;
}

.chat-box.dark-theme :deep(.info-label) {
  color: #a0a0a0;
}

:deep(.info-value) {
  font-weight: 500;
}

:deep(.taxi-card-footer) {
  display: flex;
  gap: 10px;
}

:deep(.taxi-btn) {
  flex: 1;
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

:deep(.cancel-btn) {
  background: white;
  color: #333;
}

.chat-box.dark-theme :deep(.cancel-btn) {
  background: #2c2c2c;
  color: #fff;
  border-color: #434343;
}

:deep(.confirm-btn) {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

:deep(.taxi-btn:hover) {
  opacity: 0.8;
}
</style>