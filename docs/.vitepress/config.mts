import { defineConfig } from 'vitepress'

/**
 * 部署路径前缀：
 * - Netlify / 本地开发：根路径 `/`
 * - GitHub Pages 项目站点：`/<仓库名>/`，由 CI 注入 BASE_PATH 环境变量
 */
const base = process.env.BASE_PATH || '/'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Gherkin 从零到一',
  description: '面向纯小白的 Gherkin / BDD 行为描述语言系列教程：语法、场景写作、Cucumber 实战与案例合集',
  base,
  lastUpdated: true,
  cleanUrls: false,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}logo.svg` }],
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Gherkin 从零到一 · BDD 行为描述语言系列教程' }],
    ['meta', { property: 'og:description', content: '从 Gherkin 为什么会出现讲起，吃透语法与场景写作方法，再用 Cucumber 把特性文件真正跑起来。' }],
  ],

  markdown: {
    lineNumbers: false,
    image: {
      // 教程内图片按需懒加载
      lazyLoading: true,
    },
  },

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Gherkin 从零到一',

    nav: [
      { text: '教程', link: '/guide/', activeMatch: '/guide/' },
      { text: '语法详解', link: '/guide/02-syntax' },
      { text: '案例合集', link: '/guide/06-case-studies' },
      { text: 'GitHub', link: 'https://github.com/cuianbing/gherkin-tutorial' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始之前',
          items: [{ text: '系列目录与学习路线', link: '/guide/' }],
        },
        {
          text: '基础篇 · 读懂与写作',
          items: [
            { text: '第 1 篇 · 认识 Gherkin', link: '/guide/01-what-is-gherkin' },
            { text: '第 2 篇 · 语法详解', link: '/guide/02-syntax' },
            { text: '第 3 篇 · 写出好场景', link: '/guide/03-writing-scenarios' },
          ],
        },
        {
          text: '实战篇 · 跑起来',
          items: [
            { text: '第 4 篇 · Cucumber 实战（Java）', link: '/guide/04-cucumber-java' },
            { text: '第 5 篇 · 多语言绑定概览', link: '/guide/05-bindings' },
          ],
        },
        {
          text: '案例篇 · 落地',
          items: [{ text: '第 6 篇 · 场景案例合集', link: '/guide/06-case-studies' }],
        },
      ],
    },

    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '最后更新于' },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',
    darkModeSwitchLabel: '主题',
    langMenuLabel: '语言',

    editLink: {
      pattern: 'https://github.com/cuianbing/gherkin-tutorial/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            noResultsText: '没有找到相关内容',
            resetButtonTitle: '清除查询条件',
            displayDetails: '显示详细列表',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/cuianbing/gherkin-tutorial' }],

    footer: {
      message: '基于 MIT 许可发布 · 教程内容遵循 CC BY 4.0',
      copyright: 'Copyright © 2026 cuianbing',
    },
  },
})
