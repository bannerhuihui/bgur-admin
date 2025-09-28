<template>
  <el-menu
    class="app-menu"
    :default-active="route.path"
    :collapse="collapse"
    router
    unique-opened
  >
    <MenuItem v-for="item in topLevel" :key="item.path" :item="item" />
  </el-menu>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'
import MenuItem from './MenuItem.vue'

// 折叠状态由父组件控制（主布局）
const props = defineProps({
  collapse: { type: Boolean, default: false }
})

const userStore = useUserStore()
const route = useRoute()

// 过滤隐藏项
function filterVisible(items) {
  return (items || []).filter(i => !i.hidden)
}

// 排序函数：按 sort 升序
function sortBy(sorter, items) {
  const arr = (items || []).slice()
  arr.sort(sorter)
  return arr
}

const childSorter = (a, b) => (a.sort || 0) - (b.sort || 0)

const topLevel = computed(() => {
  const list = filterVisible(userStore.menuTree)
  return sortBy(childSorter, list)
})
</script>

<style scoped>
.app-menu {
  border-right: none;
}
</style>