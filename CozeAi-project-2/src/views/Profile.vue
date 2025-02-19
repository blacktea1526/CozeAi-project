<template>
    <div class="profile-container">
      <el-card>
        <h2>个人资料</h2>
        
        <el-form :model="form" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="form.username" disabled />
          </el-form-item>
          
          <el-form-item label="邮箱">
            <el-input v-model="form.email" />
          </el-form-item>
          
          <el-form-item label="新密码">
            <el-input type="password" v-model="form.newPassword" />
          </el-form-item>
          
          <el-button 
            type="primary"
            @click="handleUpdate"
            :loading="loading"
          >
            更新资料
          </el-button>
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue'
  import api from '../services/api'
  import { ElMessage } from 'element-plus'
  
  const loading = ref(false)
  const form = reactive({
    username: '',
    email: '',
    newPassword: ''
  })
  
  onMounted(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const user = JSON.parse(userData)
      form.username = user.username
      form.email = user.email
    }
  })
  
  const handleUpdate = async () => {
    try {
      loading.value = true
      const userId = JSON.parse(localStorage.getItem('user') || '{}').id
      await api.patch(`/users/${userId}`, {
        email: form.email,
        ...(form.newPassword && { password: form.newPassword })
      })
      ElMessage.success('资料更新成功')
    } catch (error) {
      ElMessage.error('更新失败')
    } finally {
      loading.value = false
    }
  }
  </script>