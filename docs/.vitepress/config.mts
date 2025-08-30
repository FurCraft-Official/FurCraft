import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "FurCraft",
  description: "FurCraft服务器官网",
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.png',
    nav: [
      { text: '首页', link: '/' },
      { text: '友情链接', link: '/links' },
      { text: "赞助我们", link: '/donate' },
      { text: '监测站', link: 'https://status.furcraft.top/'}
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],
    footer: {
      message: "Powered by <a href=\"https://vitepress.dev\">VitePress</a><br>Prepared by <a href=\"https://www.beichen.icu\">BeiChen</a>",
      copyright: 'Copyright © 2023- 2025 <a href="/">FurCraft</a>.保留所有权利'
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/FurCraft-Official/FurCraft' }
    ]
  }
})
