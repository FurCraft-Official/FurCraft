<template>
  <div class="server-status-card">
    <!-- 加载状态 -->
    <div v-if="loading && !serverData" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading server status...</p>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <p class="error-message">Failed to load server status: {{ error }}</p>
      <button @click="fetchServerStatus" class="retry-button">Retry</button>
    </div>
    
    <!-- 正常状态 -->
    <div v-else-if="serverData">
      <div class="title">
        <span>服务器状态：</span>
      </div>
      <div class="server-header">
        <div class="server-icon" v-if="serverData.icon">
          <img :src="serverData.icon" alt="Server Icon" />
        </div>
        <div class="server-info">
          <h3 class="server-name">{{ serverData.name }}</h3>
          <div class="server-version">{{ serverData.version }}</div>
          <div class="server-status" :class="{ online: serverData.online, offline: !serverData.online }">
            <span class="status-dot"></span>
            {{ serverData.online ? 'Online' : 'Offline' }}
          </div>
        </div>
        <div class="refresh-indicator" :class="{ loading: loading }">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2"/>
            <path d="M12 6V12L16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
      </div>
      
      <div class="server-details">
        <div class="detail-item">
          <span class="label">Players:</span>
          <span class="value">{{ serverData.players.online }}/{{ serverData.players.max }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Ping:</span>
          <span class="value">{{ serverData.ping }}ms</span>
        </div>
        <div class="detail-item">
          <span class="label">Type:</span>
          <span class="value">{{ serverData.type.toUpperCase() }}</span>
        </div>
      </div>
      
      <div class="server-motd" v-if="serverData.motd">
        <div class="motd-label">MOTD:</div>
        <div class="motd-content" v-html="formatMotd(serverData.motd)"></div>
      </div>
      
      <div class="player-bar">
        <div class="player-fill" :style="{ width: playerPercentage + '%' }"></div>
      </div>
      
      <div class="last-updated" v-if="serverData.timestamp">
        Last updated: {{ formatTimestamp(serverData.timestamp) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  apiUrl: {
    type: String,
    default: 'https://example.com/api/server-status'
  },
  refreshInterval: {
    type: Number,
    default: 30000 // 30秒刷新一次
  }
})

const serverData = ref(null)
const loading = ref(true)
const error = ref(null)
let refreshTimer = null

const playerPercentage = computed(() => {
  if (!serverData.value || !serverData.value.players) return 0
  return (serverData.value.players.online / serverData.value.players.max) * 100
})

// 获取服务器状态
const fetchServerStatus = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await fetch(props.apiUrl)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    serverData.value = data
  } catch (err) {
    error.value = err.message
    console.error('Failed to fetch server status:', err)
  } finally {
    loading.value = false
  }
}

// 启动定时刷新
const startRefresh = () => {
  if (props.refreshInterval > 0) {
    refreshTimer = setInterval(fetchServerStatus, props.refreshInterval)
  }
}

// 停止定时刷新
const stopRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

// 组件挂载时获取数据并启动定时刷新
onMounted(() => {
  fetchServerStatus()
  startRefresh()
})

// 组件卸载时清理定时器
onUnmounted(() => {
  stopRefresh()
})

// 格式化时间戳
const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString()
}

// 格式化 MOTD 的函数
const formatMotd = (motd) => {
  if (!motd) return ''
  
  // Minecraft 颜色代码转换
  const colorMap = {
    '§0': '<span style="color: #000000">',
    '§1': '<span style="color: #0000AA">',
    '§2': '<span style="color: #00AA00">',
    '§3': '<span style="color: #00AAAA">',
    '§4': '<span style="color: #AA0000">',
    '§5': '<span style="color: #AA00AA">',
    '§6': '<span style="color: #FFAA00">',
    '§7': '<span style="color: #AAAAAA">',
    '§8': '<span style="color: #555555">',
    '§9': '<span style="color: #5555FF">',
    '§a': '<span style="color: #55FF55">',
    '§b': '<span style="color: #55FFFF">',
    '§c': '<span style="color: #FF5555">',
    '§d': '<span style="color: #FF55FF">',
    '§e': '<span style="color: #FFFF55">',
    '§f': '<span style="color: #FFFFFF">',
    '§l': '<strong>',
    '§r': '</span>'
  }
  
  let formatted = motd.replace(/\n/g, '<br>')
  
  Object.keys(colorMap).forEach(code => {
    const regex = new RegExp('\\' + code, 'g')
    formatted = formatted.replace(regex, colorMap[code])
  })
  
  // 添加缺失的结束标签
  const openTags = (formatted.match(/<span/g) || []).length
  const closeTags = (formatted.match(/<\/span>/g) || []).length
  const strongTags = (formatted.match(/<strong>/g) || []).length
  const closeStrongTags = (formatted.match(/<\/strong>/g) || []).length
  
  for (let i = 0; i < openTags - closeTags; i++) {
    formatted += '</span>'
  }
  for (let i = 0; i < strongTags - closeStrongTags; i++) {
    formatted += '</strong>'
  }
  
  return formatted
}
</script>

<style scoped>
.server-status-card {
  border: 2px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 20px;
  margin: 16px 0;
  background: var(--vp-c-bg-soft);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.dark .server-status-card {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
}

.server-status-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.15);
  border-color: var(--vp-c-brand);
}

.dark .server-status-card:hover {
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.4);
}

.server-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.server-icon {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid var(--vp-c-border);
  background: var(--vp-c-bg);
}

.server-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.server-info h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.server-version {
  color: var(--vp-c-text-2);
  font-size: 14px;
  margin-top: 4px;
}

.server-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  font-weight: 600;
  font-size: 14px;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ef4444;
}

.server-status.online .status-dot {
  background: #22c55e;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2);
}

.server-status.online {
  color: #16a34a;
}

.server-status.offline {
  color: #dc2626;
}

.server-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.detail-item {
  background: var(--vp-c-bg);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-border);
  transition: all 0.2s ease;
}

.detail-item:hover {
  border-color: var(--vp-c-brand);
  transform: translateY(-1px);
}

.detail-item .label {
  font-weight: 600;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.detail-item .value {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-top: 4px;
}

.server-motd {
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.4;
  border: 1px solid var(--vp-c-border);
}

.motd-label {
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-bottom: 8px;
  font-size: 12px;
}

.motd-content {
  white-space: pre-wrap;
}

.player-bar {
  width: 100%;
  height: 8px;
  background: var(--vp-c-bg);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--vp-c-border);
}

.player-fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
  border-radius: 4px;
  transition: width 0.5s ease;
}

/* 加载状态样式 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  color: var(--vp-c-text-2);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--vp-c-border);
  border-top: 3px solid var(--vp-c-brand);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误状态样式 */
.error-state {
  text-align: center;
  padding: 40px;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-message {
  color: var(--vp-c-danger);
  margin-bottom: 20px;
  font-weight: 500;
}

.retry-button {
  background: var(--vp-c-brand);
  color: var(--vp-c-bg);
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.retry-button:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-1px);
}

/* 刷新指示器 */
.refresh-indicator {
  margin-left: auto;
  color: var(--vp-c-text-3);
  transition: transform 0.3s ease;
}

.refresh-indicator.loading {
  animation: spin 2s linear infinite;
  color: var(--vp-c-brand);
}

/* 最后更新时间 */
.last-updated {
  text-align: center;
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-border);
}
.title{
  margin: 0;
  padding-bottom: 1.5em;
}
.title span{
  font-weight: 800;
  font-size: 1.4em;
}

@media (max-width: 768px) {
  .server-header {
    flex-direction: column;
    text-align: center;
  }
  .title{
    display: none;
  }
  
  .server-details {
    grid-template-columns: 1fr;
  }
}
</style>