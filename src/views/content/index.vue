<template>
  <div class="content-container">
    <router-view />
  </div>
</template>

<script setup>
// 内容管理模块容器组件
// 用于承载子路由：review.vue, message.vue
</script>

<style scoped>
.content-container {
  width: 100%;
  height: 100%;
}
</style>