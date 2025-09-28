<template>
  <div class="auth-container">
    <router-view />
  </div>
</template>

<script setup>
// 角色权限管理模块容器组件
// 用于承载子路由：role.vue, permission.vue, user-role.vue, role-permission.vue
</script>

<style scoped>
.auth-container {
  width: 100%;
  height: 100%;
}
</style>