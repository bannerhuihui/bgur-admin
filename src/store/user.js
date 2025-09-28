import { defineStore } from 'pinia'
import { useTabsStore } from './tabs'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    refreshToken: localStorage.getItem('refreshToken') || '',
    userInfo: (() => {
      try { return JSON.parse(localStorage.getItem('userInfo') || 'null') } catch (e) { return null }
    })(),
    menuTree: [], // 新增：菜单树（建议由服务端下发，不做持久化，避免旧数据）
    routesAdded: false // 新增：动态路由是否已注册
  }),
  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token || '')
    },
    setRefreshToken(refreshToken) {
      this.refreshToken = refreshToken
      localStorage.setItem('refreshToken', refreshToken || '')
    },
    setUserInfo(userInfo) {
      this.userInfo = userInfo
      try { localStorage.setItem('userInfo', JSON.stringify(userInfo || null)) } catch (e) { /* ignore */ }
    },
    setMenuTree(menuTree) { // 新增
      this.menuTree = menuTree
    },
    setRoutesAdded(val) { // 新增
      this.routesAdded = val
    },
    logout() {
      this.token = ''
      this.refreshToken = ''
      this.userInfo = null
      this.menuTree = [] // 新增
      this.routesAdded = false // 新增
      // 清理本地持久化
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userInfo')
      // 同步清空标签页
      try {
        const tabsStore = useTabsStore()
        tabsStore.reset()
      } catch (e) { /* ignore */ }
    }
  }
})