<template>
  <el-row class="login-row" style="height: 100vh; margin: 0;">
    <el-col
      :xs="24"
      :sm="24"
      :md="16"
      :lg="16"
      :xl="16"
      class="login-img-col"
    >
      <div class="login-img-box">
        <img :src="appConfig.images.loginBackground" alt="login" />
      </div>
    </el-col>
    <el-col
      :xs="24"
      :sm="24"
      :md="8"
      :lg="8"
      :xl="8"
      class="login-form-col"
    >
      <div class="login-form-box">
        <el-form :model="form" @submit.prevent>
          <div class="login-title">{{ appConfig.pages.login.subtitle }}</div>
          <div class="divider"></div>
          <div class="login-subtitle">{{ appConfig.pages.login.title }}</div>
          <el-form-item>
            <el-input v-model="form.username" placeholder="登录名" name="username" prefix-icon="UserFilled" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="form.password" type="password" placeholder="密码" name="password" prefix-icon="Lock" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 100%" @click="handleLogin">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { loginApi } from '@/api/login'
import { setToken, setRefreshToken, setUserInfo } from '@/utils/token'
import { useUserStore } from '@/store/user'
import { appConfig } from '@/config/app.js'

const router = useRouter()
const userStore = useUserStore() 
const form = reactive({
  username: 'superadmin',
  password: '123456'
})

function handleLogin() {
  loginApi({ username: form.username, password: form.password })
    .then(res => {
      setToken(res.accessToken)
      setRefreshToken(res.refreshToken)
      setUserInfo(res.user)
      userStore.setToken(res.accessToken)
      userStore.setRefreshToken(res.refreshToken)
      userStore.setUserInfo(res.user)
      router.push('/') // 跳转首页
    })
    .catch(err => {
      console.error('登录失败：', err)
    })
}
</script>

<style scoped>
.login-row {
  height: 100vh;
  margin: 0;
}
.login-img-col, .login-form-col {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
}
.login-img-box img {
  max-width: 100%;
  max-height: 60vh;
  display: block;
  margin: 0 auto;
}
.login-form-box {
  width: 280px;
}
@media (max-width: 900px) {
  .login-form-box {
    margin-left: 0;
  }
}
.login-title {
  margin-bottom: 3px;
  font-weight: 600;
  text-align: center;
  font-size: 2em;
}
.divider {
  width: 60%;
  height: 1px;
  background: #e0e0e0;
  margin: 0 auto;
  border: none;
}
.login-subtitle {
  margin-bottom: 16px;
  color: #888;
  text-align: center;
  font-size: 2em;
  font-weight: 600;
}
</style>