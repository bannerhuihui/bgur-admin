import { defineStore } from 'pinia'

export const useTabsStore = defineStore('tabs', {
  state: () => ({
    tabs: [], // { name, title, path, closable }
    active: ''
  }),
  actions: {
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
          return next // 让调用者决定是否导航
        }
      }
      return null
    },
    // 设置活动标签
    setActive(name) {
      this.active = name
    },
    // 重置（如退出登录）
    reset() {
      this.tabs = []
      this.active = ''
    }
  }
})