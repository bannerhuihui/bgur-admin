<template>
  <div class="dashboard-container">
    <router-view />
  </div>
</template>

<script setup>
// 首页模块容器组件
// 用于承载子路由：overview.vue（数据概览）, report.vue（统计报表）
</script>

<style scoped>
.dashboard-container {
  width: 100%;
  height: 100%;
}
</style>