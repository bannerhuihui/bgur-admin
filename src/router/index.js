import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'
// 动态路由：从后端菜单树生成路由对象的工具
import { generateRoutesFromMenuTree } from '@/utils/dynamicRoutes'
// 获取菜单树的接口（如果接口暂不可用，会自动回退到 public/roter.json）
import { getMenuTree } from '@/api/dashboard'

const routes = [
  {
    path: '/login',
    name: '/login',
    component: () => import('../views/login/index.vue')
  },{
    path: '/',
    name: '/',
    component: () => import('../views/main/index.vue'),
    children: [
      {
        path: 'home',
        name: '/home',
        component: () => import('../views/home/index.vue'),
        meta: { title: '首页', affix: true }
      },
      { path: '', redirect: '/home' }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：登录校验 + 动态路由注入
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const token = localStorage.getItem('accessToken') || userStore.token

  // 0) 已登录访问登录页：不允许进入登录页，直接重定向到首页
  if (to.path === '/login' && token) {
    next('/')
    return
  }

  // 1) 未登录：拦截到登录页
  if (to.path !== '/login' && !token) {
    next('/login')
    return
  }

  // 2) 已登录且尚未完成动态路由注册：在首个受保护页面访问时注入路由
  //    说明：只在首次需要时进行（routesAdded=false），避免每次跳转都重复注入导致性能与重复注册问题
  if (to.path !== '/login' && token && !userStore.routesAdded) {
    try {
      // 2.1 优先调用后端接口获取菜单树
      //     接口位置：/src/api/dashboard.js 中的 getMenuTree（第 6 行为请求路径）
      //     预期返回格式：{ menuTree: Array<后端菜单项> }
      let data = await getMenuTree()
      let menuTree = Array.isArray(data?.menuTree) ? data.menuTree : []

      // 2.2 若接口暂不可用或返回为空，则回退到 public/roter.json（静态模拟数据）
      if (!menuTree.length) {
        try {
          const resp = await fetch('/roter.json', { cache: 'no-store' })
          if (resp.ok) {
            const json = await resp.json()
            menuTree = Array.isArray(json?.menuTree) ? json.menuTree : []
          }
        } catch (fallbackErr) {
          // 回退失败不抛出异常，继续后续逻辑（避免阻断导航）
          console.warn('[router] fallback to /roter.json failed:', fallbackErr)
        }
      }

      // 2.3 将菜单树存入用户状态，便于后续 Menu/Breadcrumb/Tabs 使用
      userStore.setMenuTree(menuTree)

      // 2.4 基于菜单树生成 Vue Router 路由对象数组
      //     设计约定：子路由 path 使用“相对父级”的写法，如 dashboard、dashboard/overview 等
      //     同时，我们在工具中已将“route.name 设计为与完整路径 fullPath 完全一致”，便于统一标识
      const dynRoutes = generateRoutesFromMenuTree(menuTree, '')

      // 2.5 注入到主布局（'/'）的子路由下，使最终访问路径形如：/dashboard、/product/list
      const parentName = '/'
      const hasParent = router.hasRoute(parentName)

      // 为避免重复注册：以路由 name（即完整路径 fullPath）作为唯一标识进行去重
      for (const r of dynRoutes) {
        if (router.hasRoute(r.name)) continue
        if (hasParent) {
          // 作为 '/' 的子路由注入（r.path 是相对路径，如 'dashboard'）
          router.addRoute(parentName, r)
        } else {
          // 万一主布局未注册（极少数情况），则作为顶级路由注入
          router.addRoute(r)
        }
      }

      // 2.6 标记已完成动态路由注册，避免重复注入
      userStore.setRoutesAdded(true)

      // 2.7 关键：使用 replace=true 重新进入当前目标路由，以确保新注入的路由被正确匹配
      next({ ...to, replace: true })
      return
    } catch (err) {
      // 动态路由注入失败不阻断导航，仅输出日志
      console.warn('[router] dynamic route inject failed:', err)
    }
  }

  // 3) 常规放行
  next()
})

export default router