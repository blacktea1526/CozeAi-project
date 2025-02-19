<!-- views/Register.vue -->
<template>
    <div class="register-container">
      <el-card class="register-box">
        <h2>注册新用户</h2>
        <el-form 
          :model="form" 
          :rules="rules"
          @submit.prevent="handleRegister"
        >
          <el-form-item prop="username">
            <el-input
              v-model="form.username"
              placeholder="用户名"
              prefix-icon="User"
            />
          </el-form-item>
  
          <el-form-item prop="email">
            <el-input
              v-model="form.email"
              placeholder="邮箱"
              prefix-icon="Message"
              type="email"
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="密码"
              prefix-icon="Lock"
              show-password
            />
          </el-form-item>
  
          <el-form-item prop="confirmPassword">
            <el-input
              v-model="form.confirmPassword"
              type="password"
              placeholder="确认密码"
              prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          
          <el-button
            type="primary"
            native-type="submit"
            :loading="loading"
            class="register-btn"
          >
            立即注册
          </el-button>
          
          <div class="login-link">
            已有账号？<router-link to="/login">立即登录</router-link>
          </div>
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import useAuth from '../composeables/useAuth'
  import { ElMessage } from 'element-plus'
  import type { FormRules } from 'element-plus'
  
  const router = useRouter()
  const { register, loading } = useAuth()
  
  const form = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const validatePassword = (rule: any, value: string, callback: Function) => {
    if (value !== form.password) {
      callback(new Error('两次输入密码不一致'))
    } else {
      callback()
    }
  }
  
  const rules: FormRules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true, message: '请确认密码', trigger: 'blur' },
      { validator: validatePassword, trigger: 'blur' }
    ]
  }
  
  const handleRegister = async () => {
    if (!form.username || !form.password) return
    
    try {
      await register({
        username: form.username,
        password: form.password,
        email: form.email
      })
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }
  </script>