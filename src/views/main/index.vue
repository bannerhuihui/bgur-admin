<template>
  <div class="common-layout">
    <el-container class="full-height">
      <!-- 侧边栏：可折叠并在小屏自动折叠 -->
      <el-aside :width="isCollapse ? '64px' : '200px'" class="aside" :class="{ collapsed: isCollapse }">
        <!-- Logo 区域 -->
        <div class="logo-container">
          <img :src="appConfig.images.logo" alt="Logo" class="logo" />
          <span v-if="!isCollapse" class="logo-text">{{ appConfig.pages.main.logoText }}</span>
        </div>
        <AppMenu :collapse="isCollapse" />
      </el-aside>
      <el-container>
        <!-- Header：添加折叠按钮，控制侧边栏 -->
        <el-header class="header">
          <div class="header-left">
            <el-icon class="collapse-btn" @click="handleToggle">
              <Expand v-if="isCollapse" />
              <Fold v-else />
            </el-icon>
            <el-breadcrumb separator="/" class="breadcrumb">
              <el-breadcrumb-item v-for="b in breadcrumbs" :key="b.path" :to="{ path: b.path }">
                {{ b.title }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <el-avatar v-if="avatarUrl" :src="avatarUrl" :size="28" />
            <el-icon v-else><Avatar /></el-icon>
            <span class="user-name">{{ displayName }}</span>
            <el-dropdown trigger="click" @command="handleUserCommand">
              <span class="dropdown-trigger">
                <el-icon><ArrowDownBold /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 将子路由渲染在主区域 -->
        <el-main class="main">
          <!-- Tabs：展示已打开的页面标签 -->
          <div class="tabs-wrapper">
            <el-tabs
              v-model="tabsStore.active"
              type="border-card"
              @tab-remove="handleTabRemove"
              @tab-change="handleTabChange"
            >
              <el-tab-pane
                v-for="t in tabsStore.tabs"
                :key="t.name"
                :name="t.name"
                :label="t.title"
                :closable="t.closable"
              >
                <router-view />
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-main>
        <el-footer class="footer">
          <div class="footer-content">
            {{ appConfig.footer.appName }} 后台管理系统 如有疑问 请联系：
            <span class="footer-email">
              {{ appConfig.footer.contactEmail }}
            </span>
          </div>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppMenu from '@/components/AppMenu.vue'
import { useTabsStore } from '@/store/tabs'
import { appConfig } from '@/config/app.js'

const router = useRouter()
const route = useRoute()
const tabsStore = useTabsStore()

// 侧边栏折叠状态
const isCollapse = ref(false)

function handleToggle() {
  isCollapse.value = !isCollapse.value
}

function updateCollapse() {
  // 900px 以下自动折叠侧边栏，类似登录页的响应式阈值
  isCollapse.value = window.innerWidth < 900
}

onMounted(() => {
  updateCollapse()
  window.addEventListener('resize', updateCollapse)
  // 初次进入主布局
  if (route.path === '/') {
    router.replace('/home').then(() => {
      // 路由已切换到 /home，明确加入首页标签
      const current = router.currentRoute.value
      if (current?.path !== '/') {
        tabsStore.addOrActivate(current)
      }
    })
  } else {
    // 非根路径，直接加入当前路由为标签
    tabsStore.addOrActivate(route)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateCollapse)
})

// 路由变化时，同步到标签栏
watch(() => route.fullPath, () => {
  // 将所有实际子页面加入标签；根路径 '/' 不加入
  if (route.path !== '/') {
    tabsStore.addOrActivate(route)
  }
})

// 关闭标签
function handleTabRemove(name) {
  const next = tabsStore.remove(name)
  if (next) {
    router.push(next.path)
  } else {
    // 没有标签了，返回首页（或你期望的默认页）
    router.push('/')
  }
}
// 切换标签时，跳转到对应路由
function handleTabChange(name) {
  const target = tabsStore.tabs.find(t => t.name === name)
  if (target) router.push(target.path)
}
// 用户下拉菜单命令处理
async function handleUserCommand(cmd) {
  if (cmd === 'logout') {
    try {
      await logoutAndClear(userStore.userInfo?.id)
    } finally {
      userStore.logout()
      router.replace('/login')
    }
  }
}
import { Avatar, Expand, Fold, ArrowDownBold } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'
import { computed } from 'vue'
import { logoutAndClear } from '@/api/login'
const userStore = useUserStore()
const avatarUrl = computed(() => userStore.userInfo?.avatar || '')
const displayName = computed(() => userStore.userInfo?.nickname || userStore.userInfo?.username || '用户')

// 由当前路由和菜单树生成面包屑
const breadcrumbs = computed(() => {
  const path = route.path
  const result = []
  // 在 menuTree 中查找与 path 对齐的节点及其父级链
  function dfs(nodes, trail) {
    for (const n of nodes || []) {
      const nextTrail = trail.concat([n])
      if (n.path === path) return nextTrail
      const found = dfs(n.children || [], nextTrail)
      if (found) return found
    }
    return null
  }
  const chain = dfs(userStore.menuTree, []) || []
  chain.forEach(n => {
    result.push({ path: n.path, title: n.meta?.title || n.name || n.path })
  })
  return result
})
</script>

<style scoped>
.common-layout {
  width: 100%;
  height: 100vh; /* 与登录页一致，视口高度填满 */
}
.full-height {
  height: 100%;
}
.aside {
  border-right: 1px solid #eee;
  transition: width 0.2s ease;
  overflow: auto; /* 侧边栏较长时可滚动 */
}

/* Logo 区域样式 */
.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background-color: #fff;
  gap: 8px;
}

.logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
  color: #409eff;
  white-space: nowrap;
  transition: opacity 0.2s ease;
}

.collapsed .logo-container {
  justify-content: center;
  padding: 16px 8px;
}

.collapsed .logo-text {
  opacity: 0;
  width: 0;
  overflow: hidden;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.collapse-btn {
  font-size: 18px;
  cursor: pointer;
  color: #666;
  transition: color 0.2s ease;
}
.collapse-btn:hover {
  color: #409eff;
}
.brand {
  font-weight: 600;
}
.tabs-wrapper {
  padding: 12px;
  height: 100%;
}
.tabs-wrapper :deep(.el-tabs) {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.tabs-wrapper :deep(.el-tabs__content) {
  flex: 1;
  overflow: auto;
}
.tabs-wrapper :deep(.el-tabs__item) {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  margin-right: 10px;
  background-color: #F5F7FA;
  color: #606266;
}
.tabs-wrapper :deep(.el-tabs__item.is-active) {
  background-color: #409EFF;
  color: white;
}
.tabs-wrapper :deep(.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active) {
  border: none !important;
  background-color: #409EFF;
  color: white;
}
.tabs-wrapper :deep(.el-tabs--border-card > .el-tabs__header .el-tabs__item) {
  border: none !important;
}
.tabs-wrapper :deep(.el-tabs__item:last-child) {
  margin-right: 0;
}
.tabs-wrapper :deep(.el-tabs--border-card) {
  border: none;
}
.tabs-wrapper :deep(.el-tabs--border-card > .el-tabs__header) {
  background-color: transparent;
}
main {
  height: calc(100vh - 140px); /* header + footer 预估高度 */
  overflow: hidden;
  padding: 0;
}
.footer {
  border-top: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.footer-content {
  text-align: center;
  color: #999;
  font-size: 14px;
  line-height: 1.5;
}

.footer-email {
  color: inherit;
}

/* 小屏优化 */
@media (max-width: 900px) {
  .brand { display: none; }
}
.user-name { font-size: 14px; color: #333; }
.header-right { display: flex; align-items: center; gap: 10px; }
.dropdown-trigger { display: inline-flex; align-items: center; cursor: pointer; }
</style>
