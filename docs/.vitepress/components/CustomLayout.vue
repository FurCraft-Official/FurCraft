<template>
    <div class="layout-wrapper">
      <!-- 头部导航 -->
      <header class="header">
        <h1>我的网站</h1>
        <ColorModeToggle />
      </header>
  
      <!-- 主内容插槽 -->
      <main class="main-content">
        <slot />
      </main>
  
      <!-- 固定组件 -->
      <ServerStatus />
      <BackTop />
    </div>
  </template>
  
  <script setup lang="ts">
  import ServerStatus from '../components/ServerStatus.vue'
  import BackTop from '../components/BackTop.vue'
  // import ColorModeToggle from '../components/ColorModeToggle.vue'
  </script>
  
  <style scoped>
  .layout-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    background: var(--vp-c-background);
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  
  .main-content {
    flex: 1;
    padding: 1rem;
    background: var(--vp-c-background);
  }
  
  /* BackTop 和 ServerStatus 可自行在组件内控制位置 */
  </style>
  