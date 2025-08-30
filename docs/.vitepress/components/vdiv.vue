<template>
  <div class="info-box">
    <span>{{ title }}</span>
    <div class="hr"></div>
    <div class="content">
      <slot>
        {{ content }}
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  title: string
  content?: string
}>()
</script>

<style scoped>
.info-box {
  background: var(--vp-c-bg-soft);
  padding: 2em 1.5em 1.5em 1.3em;
  border: 2px solid var(--vp-c-border);
  border-radius: 12px;
  transition: all 0.3s ease;
}
.info-box:hover {
  border: 2px solid var(--vp-c-brand);
  transform: translateY(-2px);
}
.info-box span {
  font-size: 1.7em;
  font-weight: 600;
}
.hr {
  border-bottom: 1px solid var(--vp-c-border);
  padding-top: 0.8em;
}
.content {
  padding-top: 1.2em;
}
</style>
