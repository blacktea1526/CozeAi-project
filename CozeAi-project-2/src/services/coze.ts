import axios from 'axios'
import type { AxiosInstance } from 'axios'

const cozeClient: AxiosInstance = axios.create({
  baseURL: 'https://api.coze.com/v2',
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_COZE_API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

export interface CozeChatRequest {
  conversation_id: string
  bot_id: string
  user: string
  query: string
  stream?: boolean
}

export interface CozeChatResponse {
  code: number
  msg: string
  messages: {
    role: string
    type: string
    content: string
  }[]
}

export const cozeChat = async (params: CozeChatRequest): Promise<CozeChatResponse> => {
  try {
    const response = await cozeClient.post('/chat', {
     
      ...params,
      bot_id:import.meta.env.VITE_COZE_BOT_ID,
    })
    
    if (response.data.code !== 0) {
      throw new Error(`Coze API Error: ${response.data.msg}`)
    }
    
    return response.data
  } catch (error: any) {
    console.error('Coze API调用失败:', error)
    throw new Error(error.response?.data?.msg || 'AI服务暂不可用')
  }
}