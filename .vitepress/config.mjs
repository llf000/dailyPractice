import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/dailyPractice/',
  head: [['link', { rel: 'icon', href: '/dailyPractice/favicon.ico' }]],
  lastUpdated: true,
  title: "随记",
  description: "这是日常记录的一份清单",
  themeConfig: {
    logo: './logo.png',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: 'Javascript', link: '/JavaScript/', activeMatch: '/JavaScript/' },
      { text: 'CSS', link: '/css/', activeMatch: '/css/' },
      { text: 'Git', link: '/gitOperation/', activeMatch: '/gitOperation/' },
      { text: 'NodeJs', link: '/nodejs/', activeMatch: '/nodejs/' },
      {
        text: 'VUE',
        items: [
          { text: 'Vue3', link: '/vue/vue3/', activeMatch: '/vue/vue3/' },
          { text: 'Vue Router', link: '/vue/vue-router/' },
          { text: 'Pinia', link: '/vue/pinia' },
        ]
      },
      {
        text: 'Others',
        items: [
          {
            text: 'Docker',
            link: '/others/docker/',
            activeMatch: '/others/docker/'
          },
          {
            text: 'Webpack',
            link: '/others/webpack/',
            activeMatch: '/others/webpack/'
          },
        ]
      },
    ],
    sidebar: {
      '/JavaScript/': [
        {
          text: '基础',
          items: [
            { text: '基础语法', link: '/JavaScript/' },
          ]
        },
        {
          text: '手写类',
          items: [
            { text: '常见方法', link: '/JavaScript/advanced' },
            { text: '工具函数', link: '/JavaScript/tools' }
          ],
        },
        {
          text: '功能实现',
          items: [
            { text: '对象数组过滤', link: '/JavaScript/filterData' },
          ],
        }
      ],
      '/gitOperation/': [{
        text: '推送',
        items: [
          { text: '远程仓库地址设置与推送', link: '/gitOperation/' },
          { text: '...', link: '/gitOperation/one' }
        ]
      }],
      '/nodejs/': [{
        text: '基础',
        items: [
          { text: '基础模块', link: '/nodejs/' }
        ]
      }],
      '/css/': [{
        text: 'css3',
        items: [
          { text: 'css3渐变', link: '/css/' },
          { text: 'border边框', link: '/css/border' },
          { text: '文本换行', link: '/css/text-wrap' }
        ]
      }],
      '/vue/vue3/': [
        {
          text: 'API',
          items: [
            { text: '全局API', link: '/vue/vue3/' },
            { text: '组合式API', link: '/vue/vue3/CompositionAPI' },
            {
              text: '内置内容',
              items: [
                {
                  text: '指令',
                  link: '/vue/vue3/BuiltIns/directives',
                  activeMatch: '/vue/vue3/BuiltIns/directives'
                },
                { text: '组件', link: '/vue/vue3/BuiltIns/components' },
                { text: '特殊元素/属性', link: '/vue/vue3/BuiltIns/spacial' },
              ]
            },
          ],
        }
      ],
      'vue/vue-router': [
        { text: '关于Vue Router', link: '/vue/vue-router/' },
        { text: '基本用法', link: '/vue/vue-router/use' },
        { text: 'others', link: '/vue/vue-router/others' }
      ],
      '/others/docker/': [{
        text: '常用命令',
        items: [
          { text: 'Docker基础', link: '/others/docker/' },
        ]
      }],
      '/others/webpack/': [
        { text: '搭建一个vue3项目', link: '/others/webpack/' },
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
    lastUpdated: {
      text: '最后更新于'
    },
    search: {
      provider: 'local'
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    outline: {
      label: '页面导航'
    }
  }
})
