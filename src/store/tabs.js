import { defineStore } from 'pinia'

// 本地存储键名
const STORAGE_KEY = 'bgur-tabs'

export const useTabsStore = defineStore('tabs', {
  state: () => ({
    // 初始化时尝试从本地存储恢复
    tabs: (() => {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
        return Array.isArray(saved.tabs) ? saved.tabs : []
      } catch (e) { return [] }
    })(),
    active: (() => {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
        return typeof saved.active === 'string' ? saved.active : ''
      } catch (e) { return '' }
    })()
  }),
  actions: {
    // 将当前状态持久化到本地
    saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          tabs: this.tabs,
          active: this.active
        }))
      } catch (e) { /* ignore */ }
    },
    // 根据路由添加或激活标签
    addOrActivate(route) {
      const key = route.fullPath || route.path
      const title = route.meta?.title || route.name || route.path
      const closable = !route.meta?.affix // affix 固定标签不允许关闭
      const exist = this.tabs.find(t => t.name === key)
      if (!exist) {
        this.tabs.push({ name: key, title, path: route.path, closable })
      }
      this.active = key
      this.saveState()
    },
    // 移除标签
    remove(name) {
      const idx = this.tabs.findIndex(t => t.name === name)
      if (idx !== -1) {
        const removed = this.tabs.splice(idx, 1)[0]
        // 如果移除的是当前活动标签，切换到相邻标签或首页
        if (this.active === name) {
          const next = this.tabs[idx] || this.tabs[idx - 1] || this.tabs[0]
          this.active = next ? next.name : ''
          this.saveState()
          return next // 让调用者决定是否导航
        }
        this.saveState()
      }
      return null
    },
    // 设置活动标签
    setActive(name) {
      this.active = name
      this.saveState()
    },
    // 重置（如退出登录）
    reset() {
      this.tabs = []
      this.active = ''
      this.saveState()
    }
  }
})