<template>
  <div class="app">
    <ChatBox />
  </div>
</template>

<script setup>
import ChatBox from './components/ChatBox.vue'
</script>

<style scoped>
.app {
  width: 600px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}
</style>