import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
import { getToken, getRefreshToken, setToken, setRefreshToken, clearAllToken } from '@/utils/token'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器：自动携带 token
request.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    const token = userStore.token || getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 刷新token相关变量
let isRefreshing = false
let requests = []

// 响应拦截器，统一处理 code/data/message 和 401自动刷新token
request.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 2000) {
      return res.data
    } else {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || 'Error'))
    }
  },
  async error => {
    const { config, response } = error
    if (response && response.status === 401) {
      // 避免多次刷新
      if (!isRefreshing) {
        isRefreshing = true
        try {
          const refreshToken = getRefreshToken()
          // 用原生axios防止死循环，GET方式，token作为查询参数
          const res = await axios.get(`/api/refreshToken?refreshToken=${refreshToken}`)
          const newToken = res.data.data.accessToken
          setToken(newToken)
          useUserStore().setToken(newToken)
          // 重新请求队列中的请求
          requests.forEach(cb => cb(newToken))
          requests = []
          // 修改原请求token并重试
          config.headers.Authorization = `Bearer ${newToken}`
          return request(config)
        } catch (e) {
          clearAllToken()
          ElMessage.error('登录已过期，请重新登录')
          window.location.href = '/login'
          return Promise.reject(e)
        } finally {
          isRefreshing = false
        }
      } else {
        // 正在刷新，队列等待
        return new Promise(resolve => {
          requests.push(token => {
            config.headers.Authorization = `Bearer ${token}`
            resolve(request(config))
          })
        })
      }
    }
    ElMessage.error(error.message || '网络错误')
    return Promise.reject(error)
  }
)

export default request 