<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="login-container">
    <div class="main">
      coze AI
      <el-form ref="formRef" :model="form" :rules="rules">
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
            v-model="form.password"
          ></el-input>
        </el-form-item>
        <div class="btns">
          <el-button type="primary" class="btn" @click="login">登录</el-button>
          <div class="btn rest" @click="rest()">重置</div>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ElLoading, type FormInstance } from 'element-plus'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import router from '@/router'
interface Form {
  username: string
  password: string
}
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' },
  ],
}

const rest = () => {
  formRef.value?.resetFields()
}
const form = ref<Form>({
  username: '',
  password: '',
})
const formRef = ref<FormInstance>()
//http://localhost:3000/login中只有username和password两个字段，所以这里只需要传这两个字段
const login = async () => {
  const { username, password } = form.value
  if (username === '' || password === '') {
    ElMessage.error('用户名或密码不能为空')
    return
  }
  const res = await fetch('http://localhost:3000/login', {
    method: 'POST',

    body: JSON.stringify({ username, password }),
  })
  const data = await res.json()
  if (data.username === form.value.username && data.password === form.value.password) {
    ElMessage.success('登录成功')
    ElLoading.service({
      text: '正在跳转',
      background: 'rgba(0, 0, 0, 0.7)',
    })
    setTimeout(() => {
      ElLoading.service().close()
    }, 100)

    // 登录成功后跳转到主页
    // router.push('/')
    router.push('/')
  } else {
    ElMessage.error('用户名或密码错误')
    console.log(data)
  }
}
</script>
<style scoped lang="scss">
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
  position: relative;
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
      &:hover {
        background-color: #409eff;
      }
      &.rest {
        margin-left: 10px;
        color: #909399;
        border: 1px solid #dcdfe6;
        cursor: pointer;
        &:hover {
          background: #201f1f;
          text-decoration: underline;
          color: #fff;
        }
      }
    }
  }
}
</style>
