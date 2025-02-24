<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <h2>{{ currentTitle || 'Coze Chat' }}</h2>
      </el-header>
      <el-container>
        <!-- 左侧边栏 -->
        <el-aside width="240px" class="sidebar">
          <div class="dialogue-selector">
            <h3>对话列表</h3>
            <el-select
              v-model="currentDialogue"
              placeholder="选择对话"
              @change="loadSelectedDialogue"
              class="dialogue-dropdown"
            >
              <el-option
                v-for="dialogue in dialogues"
                :key="dialogue"
                :label="dialogue"
                :value="dialogue"
              />
            </el-select>
            <div class="dialogue-actions">
              <el-input v-model="NewTitle" placeholder="对话名称"></el-input>
              <el-button type="primary" @click="createNewDialogue" plain>新建</el-button>
              <el-button
                type="danger"
                @click="deleteCurrentDialogue"
                :disabled="!currentDialogue"
                plain
                >删除</el-button
              >
            </div>
          </div>

          <!-- 用户信息 -->
          <div class="user-section">
            <div class="user-profile">
              <el-avatar :size="60" :src="userAvatar" />
              <p class="username">{{ userStore.userName }}</p>
              <el-link type="primary" :underline="false">编辑资料</el-link>
              <e-button type="primary" @click="logout" class="logout-btn">退出登录</e-button>
            </div>
          </div>

          <!-- About信息 -->
          <div class="about-info">
            <el-divider />
            <p class="about-text">
              Coze Chat v1.0<br />
              © 2024 Your Company<br />
              <el-link type="info" :underline="false">隐私政策</el-link>
            </p>
          </div>
        </el-aside>

        <!-- 主聊天区域 -->

        <el-main class="main-chat">
          <div class="chat-container">
            <div ref="chatBox" class="chat-messages">
              <div
                v-for="(message, index) in chatHistory"
                :key="index"
                class="message"
                :class="message.role"
              >
                <div class="message-content">
                  <el-avatar :size="32" :src="message.role === 'user' ? userAvatar : botAvatar" />
                  <div class="message-bubble">
                    <div v-if="message.role === 'assistant'" class="typewriter">
                      <span
                        v-if="isLoading && index === chatHistory.length"
                        class="loading-indicator"
                      ></span>
                      <span v-else v-html="renderMarkdown(message.content)"></span>
                    </div>
                    <div v-else v-html="renderMarkdown(message.content)"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 输入区域 -->
            <el-affix position="bottom" :offset="30">
              <div class="chat-input">
                <el-input
                  v-model="userQuery"
                  placeholder="输入消息..."
                  @keyup.enter="sendMessage"
                  class="input-box"
                >
                  <template #append>
                    <el-button type="primary" @click="sendMessage" icon="el-icon-position" />
                  </template>
                </el-input>
              </div>
            </el-affix>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { marked } from 'marked'
import { createCoze } from '../apis/coze'
import { userStore } from '@/stores/user'

// 配置常量
const userAvatar = userStore.userAvatar
const botAvatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'

// Coze配置
const coze = createCoze({
  baseUrl: 'https://api.coze.cn',
  accessToken: 'pat_asTVGz613e9LZznNFevzHn7vehGgxO90tKanuoDSQve6OplyHrIy41ldXEzPzfT6',
})

// 状态管理
const NewTitle = ref('')
const currentTitle = ref('新对话')
const currentDialogue = ref('')
const dialogues = ref([])
const chatHistory = ref([])
const userQuery = ref('')
const chatBox = ref(null)
const conversationId = ref('')
const isLoading = ref(false)

// 初始化加载对话
onMounted(() => {
  loadAllDialogues()
})

// 加载所有对话
function loadAllDialogues() {
  const storedDialogues = localStorage.getItem('cozeDialogues')
  if (storedDialogues) {
    //如果存在本地存储的对话列表，则加载本地存储的对话列表
    const dialoguesData = JSON.parse(storedDialogues) //解析本地存储的对话列表
    dialogues.value = Object.keys(dialoguesData)
    if (dialogues.value.length > 0) {
      currentDialogue.value = dialogues.value[0] //
      loadSelectedDialogue()
    }
  }
}

// 创建新对话
function createNewDialogue() {
  const newDialogue = `对话_${Date.now()}`
  if (!NewTitle.value.trim()) {
    NewTitle.value = newDialogue
  }

  currentDialogue.value = NewTitle.value
  if (!dialogues.value.includes(NewTitle.value)) {
    dialogues.value.push(NewTitle.value)
  }
  conversationId.value = ''
  chatHistory.value = []
  saveCurrentDialogue()
  scrollToBottom()
  NewTitle.value = ''
}

// 删除当前对话
function deleteCurrentDialogue() {
  if (!currentDialogue.value) return

  const dialoguesData = JSON.parse(localStorage.getItem('cozeDialogues') || {})
  delete dialoguesData[currentDialogue.value]
  localStorage.setItem('cozeDialogues', JSON.stringify(dialoguesData))

  dialogues.value = dialogues.value.filter((d) => d !== currentDialogue.value)
  currentDialogue.value = dialogues.value[0] || ''
  loadSelectedDialogue()
}

// 加载选中对话
function loadSelectedDialogue() {
  const dialoguesData = JSON.parse(localStorage.getItem('cozeDialogues') || {})
  const data = dialoguesData[currentDialogue.value]

  if (data) {
    chatHistory.value = data.chatHistory
    conversationId.value = data.conversationId
    currentTitle.value = currentDialogue.value
    scrollToBottom()
  }
}
const logout = () => {
  localStorage.removeItem('isLogin')
  window.location.href = '/login'
}

// 保存当前对话
function saveCurrentDialogue() {
  const dialoguesData = JSON.parse(localStorage.getItem('cozeDialogues') || {})
  dialoguesData[currentDialogue.value] = {
    chatHistory: chatHistory.value,
    conversationId: conversationId.value,
  }
  localStorage.setItem('cozeDialogues', JSON.stringify(dialoguesData))
}

// 发送消息
async function sendMessage() {
  if (!userQuery.value.trim()) return

  // 自动创建新对话
  if (!currentDialogue.value) {
    createNewDialogue()
  }

  isLoading.value = true

  // 添加用户消息
  const userMessage = {
    role: 'user',
    content: userQuery.value,
    timestamp: new Date().getTime(),
  }
  chatHistory.value.push(userMessage)
  const tempQuery = userQuery.value
  userQuery.value = ''

  try {
    // 调用Coze API
    const result = await coze.chat({
      bot_id: '7473098922362781734',
      user: 'user123',
      query: tempQuery,
      conversation_id: conversationId.value,
      chat_history: convertChatHistory(),
    })

    if (result.success) {
      conversationId.value = result.conversation_id
      const answers = result.getAnswers()

      if (answers.length > 0) {
        const aiMessage = {
          role: 'assistant',
          content: answers[0].content,
          timestamp: new Date().getTime(),
        }
        chatHistory.value.push(aiMessage)
        applyTypewriterEffect()
      }
    } else {
      throw new Error(result.msg)
    }
  } catch (error) {
    const errorMessage = {
      role: 'system',
      content: `错误: ${error.message}`,
      timestamp: new Date().getTime(),
    }
    chatHistory.value.push(errorMessage)
  } finally {
    isLoading.value = false
    saveCurrentDialogue()
    scrollToBottom()
  }
}

// 转换聊天记录格式
function convertChatHistory() {
  return chatHistory.value.map((msg) => ({
    role: msg.role,
    content: msg.content,
    content_type: 'text',
  }))
}

// 应用打字机效果
function applyTypewriterEffect() {
  nextTick(() => {
    const lastMsg = chatBox.value.querySelector('.assistant:last-child .message-bubble div')
    if (lastMsg) {
      typewriterEffect(lastMsg)
    }
  })
}

// 打字机效果实现
function typewriterEffect(element) {
  const text = element.textContent
  element.textContent = ''
  let i = 0
  const speed = 20

  const type = () => {
    if (i < text.length) {
      element.textContent += text.charAt(i)
      i++
      setTimeout(type, speed)
      chatBox.value.scrollTop = chatBox.value.scrollHeight
    }
  }

  type()
}

// 滚动到底部
function scrollToBottom() {
  nextTick(() => {
    if (chatBox.value) {
      chatBox.value.scrollTop = chatBox.value.scrollHeight
    }
  })
}

// Markdown渲染
const renderMarkdown = (content) => {
  return marked(content)
}
</script>
<style lang="scss" scoped>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
.common-layout {
  height: 100vh;
}

.header {
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 0 24px;
}
.header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8px;
  background: #c4e17f;
  border-radius: 5px 5px 0 0;
  background-image: linear-gradient(
    to right,
    #c4e17f,
    #c4e17f 12.5%,
    #f7fdca 12.5%,
    #f7fdca 25%,
    #fecf71 25%,
    #fecf71 37.5%,
    #f0776c 37.5%,
    #f0776c 50%,
    #db9dbe 50%,
    #db9dbe 62.5%,
    #c49cde 62.5%,
    #c49cde 75%,
    #669ae1 75%,
    #669ae1 87.5%,
    #62c2e4 87.5%,
    #62c2e4
  );
}
.logout-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.sidebar {
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
  border-right: 1px solid #e4e7ed;
  padding: 20px;

  .dialogue-selector {
    h3 {
      margin-bottom: 16px;
      color: #606266;
    }

    .dialogue-dropdown {
      margin-bottom: 16px;
      width: 100%;
    }

    .dialogue-actions {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
    }
  }

  .user-section {
    margin-top: auto;
    padding: 20px 0;
    text-align: center;

    .username {
      margin: 8px 0;
      font-weight: 500;
    }
  }

  .about-info {
    text-align: center;
    color: #909399;
    font-size: 12px;

    .about-text {
      line-height: 1.6;
    }
  }
}

.main-chat {
  padding: 0;
  background: #f5f7fa;
  height: 100vh;

  .chat-container {
    height: 100%;
    display: flex;
    flex-direction: column;

    .chat-messages {
      flex: 1;
      padding: 24px 20px;
      overflow-y: auto;
      background: #f3f5fa;

      .message {
        margin-bottom: 20px;

        &.user {
          .message-content {
            flex-direction: row-reverse;
          }
        }

        .message-content {
          display: flex;
          gap: 12px;
          max-width: 80%;
          margin: 0 auto;

          .message-bubble {
            padding: 12px 16px;
            border-radius: 8px;
            background: #fff;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

            :deep(p) {
              margin: 0;
            }
          }
        }
      }
    }

    .chat-input {
      //居中
      border-radius: 8px;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60%;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 60px;
      padding: 20px;
      background: #fff;
      box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.05);

      .input-box {
        max-width: 800px;
        margin: 0 auto;
      }
    }
  }
}

.loading-dots {
  display: inline-block;
  min-width: 3ch;

  &::after {
    content: '...';
    animation: dotPulse 1.5s infinite;
  }
}

@keyframes dotPulse {
  0%,
  20% {
    content: '.';
  }
  40% {
    content: '..';
  }
  60% {
    content: '...';
  }
  80%,
  100% {
    content: '';
  }
}
@keyframes dots {
  0%,
  20% {
    content: '.';
  }
  40% {
    content: '..';
  }
  60% {
    content: '...';
  }
  80%,
  100% {
    content: '.';
  }
}

.loading-indicator {
  font-family: Arial, sans-serif;
  font-size: 16px;
  color: #333;
}

.loading-indicator .dots {
  display: inline-block;
  animation: dots 1.5s infinite linear;
}
</style>
