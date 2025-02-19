// composables/useAuth.ts
import { ref } from 'vue'
import api from '../services/api'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import type { User } from '../type'

export default function useAuth() {
  const router = useRouter()
  const loading = ref(false)

  // 正确登录实现
  const login = async (credentials: { username: string; password: string }) => {
    try {
      loading.value = true
      // 改为GET请求验证用户
      const { data } = await api.get<User[]>(
        `/users?username=${credentials.username}&password=${credentials.password}`
      )

      if (data.length === 0) {
        throw new Error('用户不存在或密码错误')
      }

      const user = data[0]
      localStorage.setItem('token', 'mock-token')
      localStorage.setItem('user', JSON.stringify(user))
      router.push('/chat')
    } catch (error) {
      ElMessage.error('登录失败')
    } finally {
      loading.value = false
    }
  }

  // 新增注册方法
  const register = async (userData: {
    username: string
    password: string
    email: string
  }) => {
    try {
      loading.value = true
      // 检查用户名是否已存在
      const { data: existingUsers } = await api.get<User[]>(
        `/users?username=${userData.username}`
      )

      if (existingUsers.length > 0) {
        throw new Error('用户名已存在')
      }

      const { data } = await api.post<User>('/auth/register', {
        ...userData,
        createdAt: new Date().toISOString()
      })

      ElMessage.success('注册成功，请登录')
      router.push('/login')
    } catch (error: any) {
      ElMessage.error(error.message || '注册失败')
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  return { login, register, logout, loading }
}