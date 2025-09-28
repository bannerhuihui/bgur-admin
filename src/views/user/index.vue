<template>
  <div class="user-container">
    <router-view />
  </div>
</template>

<script setup>
// 用户管理模块容器组件
// 用于承载子路由：list.vue, tag.vue, extend.vue, address.vue, id-mapping.vue, point-account.vue, point-log.vue
</script>

<style scoped>
.user-container {
  width: 100%;
  height: 100%;
}
</style>