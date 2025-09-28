// src/utils/dynamicRoutes.js
import { h } from 'vue'

// 1. 预加载所有 views 下的 .vue 文件
const modules = import.meta.glob('/src/views/**/*.vue')
// 父级包裹组件：用于没有 component 的父级路由承载子路由渲染
const ParentWrapper = { render: () => h('router-view') }

// 基于 component 路径或名称兜底生成路径段
function inferSegmentFromItem(item) {
  if (item?.component) {
    const comp = item.component // 例如: views/company/list.vue
    const last = comp.split('/').pop() || ''
    return last.replace(/\.vue$/i, '') || 'index'
  }
  if (item?.name) {
    return String(item.name).trim().toLowerCase().replace(/\s+/g, '-')
  }
  return 'index'
}

// 拼接成为绝对路径（确保以 / 开头）
function joinAbsolute(parentFullPath, segment) {
  const base = parentFullPath ? parentFullPath.replace(/\/$/, '') : ''
  const seg = String(segment || '').replace(/^\//, '')
  return `${base}/${seg}`.replace(/^\/+/, '/')
}

/**
 * 将后端 menuTree 转换为 Vue Router 路由对象
 * @param {Array} menuTree 后端返回的菜单/路由树
 * @param {string} parentFullPath 父级的“绝对路径”（用于计算相对路径）
 * @returns {Array} Vue Router 路由对象数组
 */
export function generateRoutesFromMenuTree(menuTree = [], parentFullPath = '') {
  return menuTree.map(item => {
    // 1) 兜底生成“绝对路径” fullPath（当后端缺失 path 时）
    let fullPath = item.path
    if (!fullPath) {
      const segment = inferSegmentFromItem(item)
      if (parentFullPath) {
        fullPath = joinAbsolute(parentFullPath, segment)
      } else {
        fullPath = `/${segment}`
      }
    }

    // 2) 处理 component 字段
    let component
    let resolvedBy = 'none'
    let compKeyUsed = undefined
    if (item.component) {
      const compKey = `/src/${item.component}`
      component = modules[compKey] ? modules[compKey] : undefined
      if (component) {
        resolvedBy = 'component'
        compKeyUsed = compKey
      } else if (import.meta.env.DEV) {
        console.warn('[dynRoutes] component not found for', compKey)
      }
    }

    // 2.1) 兜底：基于 fullPath 推断组件文件
    if (!component) {
      const tryKeys = [
        `/src/views${fullPath}.vue`,
        `/src/views${fullPath}/index.vue`
      ]
      for (const k of tryKeys) {
        if (modules[k]) {
          component = modules[k]
          resolvedBy = 'fallback'
          compKeyUsed = k
          break
        }
      }
      if (import.meta.env.DEV && !component) {
        // 仅开发环境提示，避免生产输出噪声
        console.warn('[dynRoutes] fallback resolve failed for', fullPath, 'tried:', tryKeys)
      }
    }

    if (!component && item.children && item.children.length) {
      component = ParentWrapper
      resolvedBy = 'parent-wrapper'
      compKeyUsed = 'ParentWrapper'
    }

    // 3) 计算相对路径
    let routePath = fullPath
    if (parentFullPath) {
      const parentPrefix = parentFullPath.endsWith('/') ? parentFullPath : parentFullPath + '/'
      if (routePath.startsWith(parentPrefix)) {
        routePath = routePath.slice(parentPrefix.length)
      } else {
        routePath = routePath.replace(/^\//, '')
      }
    } else {
      routePath = routePath.replace(/^\//, '')
    }

    // 4) 递归 children
    const children = item.children && item.children.length
      ? generateRoutesFromMenuTree(item.children, fullPath)
      : []

    // 5) 默认 redirect（绝对路径）
    let defaultRedirect
    if (children.length) {
      if (item.children && item.children[0] && item.children[0].path) {
        defaultRedirect = item.children[0].path
      } else {
        defaultRedirect = joinAbsolute(fullPath, children[0].path)
      }
    }

    // 6) 最终路由对象
    const route = {
      path: routePath,
      // 将路由的 name 设计为与完整路径 fullPath 完全一致，提升一致性与可操作性
      // 这样在 Tab、Menu 等场景里只用一个标识（path/name）即可，减少维护成本
      name: fullPath, 
      meta: { ...(item.meta || {}), __fullPath: fullPath, __resolvedBy: resolvedBy, __compKey: compKeyUsed },
      hidden: item.hidden,
      redirect: item.redirect || defaultRedirect,
      component,
      children
    }

    if (import.meta.env.DEV) {
      console.debug('[dynRoutes] built route:', {
        name: route.name,
        path: route.path,
        fullPath,
        resolvedBy,
        compKeyUsed,
        hasChildren: !!children.length,
        redirect: route.redirect,
        metaTitle: route.meta?.title
      })
    }

    return route
  })
}