<template>
  <div class="order-container">
    <router-view />
  </div>
</template>

<script setup>
// 订单管理模块容器组件
// 用于承载子路由：list.vue, item.vue, logistics.vue
</script>

<style scoped>
.order-container {
  width: 100%;
  height: 100%;
}
</style>