export interface User {
    id: number
    username: string
    email: string
    password?: string
  }
  
  export interface AISession {
    id: number
    userId: number
    messages: ChatMessage[]
    timestamp: string
  }
  
  export interface ChatMessage {
    role: 'user' | 'assistant'
    content: string
  }