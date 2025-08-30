<template>
  <div class="friend-grid">
    <a
      v-for="(link, i) in links"
      :key="i"
      :href="link.url || '#'
      "
      class="friend-card"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img class="avatar" :src="link.avatar" :alt="link.title" />

      <div class="body">
        <div class="head">
          <div class="title" :title="link.title">{{ link.title }}</div>
        </div>

        <p class="desc">{{ link.description }}</p>
      </div>
    </a>
  </div>
</template>

<script setup>
// props: links - array of { title, avatar, description, url }
const props = defineProps({
  links: {
    type: Array,
    default: () => [
      {
        title: '示例站点 A',
        avatar: 'https://avatars.githubusercontent.com/u/9919?s=200&v=4',
        description: '这是示例描述，展示如何在组件中展示站点信息。',
        url: '#'
      },
      {
        title: '示例站点 B',
        avatar: 'https://avatars.githubusercontent.com/u/697188?s=200&v=4',
        description: '第二个示例，用来说明网格布局如何在一行展示多个卡片。',
        url: '#'
      }
    ]
  }
})
</script>

<style scoped>
.friend-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.friend-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding:1.2em 1.8em;
  border: 2px solid var(--vp-c-border);
  border-radius: 12px;
  transform: translateY(-2px); /* 要求的 y 轴 -2px */
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  background: rgba(255,255,255,1);
}
.dark .friend-card {
  background: rgba(30,30,30,1)
}

.friend-card:hover {
  border-color: var(--vp-c-brand); /* 悬停时变为品牌色 */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  transform: translateY(-4px);
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  flex: 0 0 48px; /* 固定头像宽度，防止换行 */
}

.body {
  display: flex;
  flex-direction: column;
  min-width: 0; /* 允许文本正确截断 */
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.title {
  font-weight: 600;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.desc {
  margin-top: 8px;
  font-size: 0.92rem;
  color: var(--vp-c-muted);
  line-height: 1.4;
  /* 多行截断，最多 3 行 */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 响应式微调 */
@media (max-width: 400px) {
  .friend-grid {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }
  .avatar {
    width: 40px;
    height: 40px;
    flex: 0 0 40px;
  }
}
</style>
