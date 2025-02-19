<template>
  <div class="chat-container">
    <el-card>
      <!-- 历史会话选择 -->
      <div class="session-select">
        <el-select 
          v-model="currentSession" 
          placeholder="选择历史会话"
          @change="loadSession"
        >
          <el-option
            v-for="session in history"
            :key="session.id"
            :label="new Date(session.timestamp).toLocaleString()"
            :value="session.id"
          />
        </el-select>
        <el-button @click="newChat">新建会话</el-button>
      </div>

      <!-- 消息列表 -->
      <div class="message-list">
        <div 
          v-for="(msg, index) in messages" 
          :key="index"
          :class="['message-item', msg.role]"
        >
          <el-avatar class="message-avatar">
            {{ msg.role === 'user' ? '我' : 'AI' }}
          </el-avatar>
          <div class="message-content">
            <div class="message-text">{{ msg.content }}</div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="input-area">
        <el-input
          v-model="inputMessage"
          type="textarea"
          :rows="3"
          placeholder="输入你的问题..."
          @keyup.ctrl.enter="handleSend"
        />
        <el-button 
          type="primary" 
          :loading="loading" 
          @click="handleSend"
          class="send-btn"
        >
          发送 (Ctrl+Enter)
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import useChat from '../composeables/useChat'
import { ElMessage } from 'element-plus'
import  api  from '../services/api'

const { messages, history, loading, sendMessage, loadHistory } = useChat()
const inputMessage = ref('')
const currentSession = ref<number | null>(null)

onMounted(() => {
  loadHistory()
})

const handleSend = async () => {
  if (!inputMessage.value.trim()) return
  
  try {
    await sendMessage(inputMessage.value)
    inputMessage.value = ''
  } catch {
    // 错误已在useChat处理
  }
}

const loadSession = async (sessionId: number) => {
  try {
    const { data } = await api.get(`/ai_sessions/${sessionId}`)
    messages.value = data.messages
  } catch (error) {
    ElMessage.error('加载会话失败')
  }
}

const newChat = () => {
  messages.value = []
  currentSession.value = null
}
</script>

<style scoped>
.message-item {
  display: flex;
  margin: 1rem 0;
}
.message-item.user {
  flex-direction: row-reverse;
}
.message-avatar {
  margin: 0 1rem;
}
.message-content {
  max-width: 70%;
  padding: 0.8rem;
  border-radius: 8px;
  background: #f5f7fa;
}
.user .message-content {
  background: #409eff;
  color: white;
}
.input-area {
  margin-top: 1rem;
  position: relative;
}
.send-btn {
  margin-top: 0.5rem;
  float: right;
}
</style>