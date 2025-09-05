---
layout: home
title: 友情链接
---
# 友情链接
与志同道合的朋友们一起探索!
<script setup>
import FriendLinks from './.vitepress/components/FriendLinks.vue'

const links = [
  {
    title: 'Craft233',
    avatar: 'https://res.neokoni.ink/craft233/img/craft233_logo.svg',
    description: '简单纯粹，在未知中探索。在尝试中找到尽可能优的生存体验。与玩家一起，携手出发。',
    url: 'https://www.craft233.top/'
  }
]
</script>

<FriendLinks :links="links" />
<style>
  .header-anchor {
    display:none;
  }
  h1{
    padding: 1em 0 0.1em 0;
  }
  p{
    font-size: 1.2em;
    margin: 0;
    padding-bottom: 1em;
  }
</style>
