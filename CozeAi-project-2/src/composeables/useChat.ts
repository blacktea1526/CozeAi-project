import { ref } from 'vue'
import { cozeChat, type CozeChatRequest } from '../services/coze'
import api from '../services/api'
import { ElMessage } from 'element-plus'
import type { ChatMessage } from '../type'

export default function useChat() {
  const messages = ref<ChatMessage[]>([])
  const history = ref<any[]>([])
  const loading = ref(false)
  const conversationId = ref(`conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)

  // 加载历史记录
  const loadHistory = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    try {
      const { data } = await api.get(`/ai_sessions?userId=${user.id}`)
      history.value = data
    } catch (error) {
      ElMessage.error('加载历史记录失败')
    }
  }

  // 发送消息
  const sendMessage = async (content: string) => {
    if (!content.trim()) return
    
    try {
      loading.value = true
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      
      // 添加用户消息
      messages.value.push({ role: 'user', content })
      
      // 调用Coze API
      const params: CozeChatRequest = {
        bot_id: import.meta.env.VITE_COZE_BOT_ID,
        conversation_id: conversationId.value,
        user: user.id.toString(),
        query: content
      }
      
      const response = await cozeChat(params)
      
      // 处理AI回复
      const aiMessage = response.messages.find(m => m.role === 'assistant')
      if (aiMessage) {
        messages.value.push({
          role: 'assistant',
          content: aiMessage.content
        })
      }
      
      // 保存到历史记录
      await api.post('/ai_sessions', {
        userId: user.id,
        messages: messages.value,
        timestamp: new Date().toISOString()
      })
      
    } catch (error: any) {
      ElMessage.error(error.message)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    messages,
    history,
    loading,
    sendMessage,
    loadHistory
  }
}