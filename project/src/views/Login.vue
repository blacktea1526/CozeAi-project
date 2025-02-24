<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-form class="sign-up" :model="loginForm" :rules="rules">
    <h1 class="sign-up-title">Sign up in seconds</h1>
    <el-form-item>
      <el-input
        v-model="loginForm.username"
        placeholder="What's your username?"
        class="sign-up-input"
        autofocus
        id="username"
      />
    </el-form-item>
    <el-form-item>
      <el-input
        v-model="loginForm.password"
        placeholder="Choose a password"
        type="password"
        class="sign-up-input"
        id="password"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" class="sign-up-button" native-type="submit" @click="login()">
        Sign me up!
      </el-button>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
interface loginType {
  username: string
  password: string
}
const loginForm = ref<loginType>({
  username: '',
  password: '',
})

const rules = {
  username: [
    { required: true, message: 'Please input your username', trigger: 'blur' },
    { min: 3, max: 10, message: 'Username must be 3 to 10 characters', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Please input your password', trigger: 'blur' },
    { min: 6, max: 16, message: 'Password must be 6 to 16 characters', trigger: 'blur' },
  ],
}

//模拟登录
const loginData = {
  username: 'admin',
  password: '123456',
}
const login = () => {
  if (
    loginForm.value.username === loginData.username &&
    loginForm.value.password === loginData.password
  ) {
    ElMessage.success('Login success')
    localStorage.setItem('isLogin', 'true')
    router.push('/')
  } else {
    ElMessage.error('Username or password is incorrect')
  }
}
</script>
<style scoped>
.sign-up {
  position: relative;

  width: 280px;
  margin: auto auto;

  padding: 33px 25px 29px;
  background: white;
  border-bottom: 1px solid #c4c4c4;
  border-radius: 5px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.25);

  justify-content: center;
  align-items: center;
}

.sign-up::before,
.sign-up::after {
  content: '';
  position: absolute;
  bottom: 1px;
  left: 0;
  right: 0;
  height: 10px;
  background: inherit;
  border-bottom: 1px solid #d2d2d2;
  border-radius: 4px;
}

.sign-up::after {
  bottom: 3px;
  border-color: #dcdcdc;
}

.sign-up-title {
  margin: -25px -25px 25px;
  padding: 15px 25px;
  line-height: 35px;
  font-size: 26px;
  font-weight: 300;
  color: #aaa;
  text-align: center;
  text-shadow: 0 1px rgba(255, 255, 255, 0.75);
  background: #f7f7f7;
}

.sign-up-title::before {
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

.sign-up-input {
  width: 100%;
  height: 50px;
  margin-bottom: 25px;
  padding: 0 15px 2px;
  font-size: 17px;
  background: white;
  border: 2px solid #ebebeb;
  border-radius: 4px;
  box-shadow: inset 0 -2px #ebebeb;
}

.sign-up-input:hover {
  border-color: #62c2e4;
  outline: none;
  box-shadow: inset 0 -2px #62c2e4;
  transition: 0.2s ease-in-out;
}

.sign-up-button {
  position: relative;
  vertical-align: top;
  width: 100%;
  height: 54px;
  padding: 0;
  font-size: 22px;
  color: white;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
  background: #f0776c;
  border: 0;
  border-bottom: 2px solid #d76b60;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: inset 0 -2px #d76b60;
}

.sign-up-button:active {
  top: 1px;
  outline: none;
  box-shadow: none;
}
::v-deep(.el-input__wrapper) {
  border: none !important;
  box-shadow: none !important;
  background: none !important;
}
</style>
