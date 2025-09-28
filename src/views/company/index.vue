<template>
  <div class="company-container">
    <router-view />
  </div>
</template>

<script setup>
// 公司管理模块容器组件
// 用于承载子路由：list.vue, wechat.vue, sms.vue
</script>

<style scoped>
.company-container {
  width: 100%;
  height: 100%;
}
</style>