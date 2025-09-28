<template>
  <div class="home-page">
    <el-card class="home-card" shadow="never">
      <div class="home-title">欢迎使用后台管理系统</div>
      <div class="home-desc">这是默认首页。您可以通过左侧菜单进入各业务页面。</div>
    </el-card>
  </div>
</template>

<script setup>
// 首页目前为静态展示，如需展示统计或快捷入口，可在此扩展
</script>

<style scoped>
.home-page {
  padding: 16px;
}
.home-card {
  min-height: 200px;
}
.home-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}
.home-desc {
  color: #666;
}
</style>