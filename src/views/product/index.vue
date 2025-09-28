<template>
  <div class="product-container">
    <router-view />
  </div>
</template>

<script setup>
// 商品管理模块容器组件
// 用于承载子路由：list.vue, category.vue, visible.vue, view-log.vue, view-stat.vue
</script>

<style scoped>
.product-container {
  width: 100%;
  height: 100%;
}
</style>