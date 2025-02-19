<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="login-container">
    <div class="main">
      <h2>Coze AI</h2>
      <el-form :model="form" :rules="rules" @submit.prevent="handleLogin">
        <el-form-item prop="username">
          <el-input
            class="input"
            placeholder="username"
            :prefix-icon="User"
            v-model="form.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            class="input"
            placeholder="password"
            :prefix-icon="Lock"
            type="password"
            show-password
            v-model="form.password"
          ></el-input>
        </el-form-item>
        <div class="btns">
          <el-button type="primary" class="btn" @click="handleLogin" :loading="loading">登录</el-button>
          <div class="btn rest" @click="reset()">重置</div>
          <!-- views/Login.vue 添加以下内容 -->
<div class="register-link mt-4">
  没有账号？<router-link to="/register">立即注册</router-link>
</div>
        </div>
      </el-form>
    </div>
  </div>
</template>
  
  <script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import useAuth from '../composeables/useAuth'
  import { ElMessage } from 'element-plus'
  import { User, Lock } from '@element-plus/icons-vue'
  const router = useRouter()
  const { login, loading } = useAuth()
  
  const form = reactive({
    username: '',
    password: ''
  })
  
  const rules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ]
  }
  
  const handleLogin = async () => {
    if (!form.username || !form.password) return
    
    try {
      await login({
        username: form.username,
        password: form.password
      })
      ElMessage.success('登录成功')
    } catch (error) {
      ElMessage.error('登录失败')
    }
  }
  const reset = () => {
    form.username = ''
    form.password = ''
  }
  </script>
  <style lang="scss" scoped>  
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%);
}

.main {
  width: 360px;
  height: 480px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  h1 {
    font-size: 100px;
    font-weight: bold;
    margin-top: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }

  .btns {
    display: flex;
    align-items: center;

    .btn {
      width: 100px;
      height: 30px;
      line-height: 30px;
      border-radius: 5px;
      font-size: 14px;
      text-align: center;
      color: #fff;
      cursor: pointer;
      background-color: #409eff;

      &:hover {
        background-color: darken(#409eff, 10%);
      }

      &.rest {
        margin-left: 10px;
        color: #909399;
        border: 1px solid #dcdfe6;
        cursor: pointer;
        background-color: #fff;

        &:hover {
          background: #201f1f;
          text-decoration: underline;
          color: #fff;
        }
      }
    }
  }
}
.register-link {
  color: #409eff;
  cursor: pointer;
  text-align: center;
  margin-top: 10px;

  &:hover {
    text-decoration: underline;
  }
  .mt-4 {
    margin-top: 40px;
  }
}
</style>