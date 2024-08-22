module.exports = {
  title: 'Front-End-Basics',
  description: '陈方旭的个人文档',
  themeConfig: {
    editLinks: true,
    repo: 'https://github.com/qiqihaobenben/Front-End-Basics',
    logo: '/logo.png',
    docsDir: 'docs',
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdated: 'Last Updated',
    nav: [
      { text: '首页', link: '/' },
      { text: '捡贝壳', link: '/article/' },
    ],
    sidebarDepth: 0,
    sidebar: {
      /** HTML 相关 */
      '/html/': ['global-attr', 'meta', 'intro', 'dom', 'cssom'],
      /** CSS 相关 */
      '/css/': [
        {
          title: '理论篇',
          collapsable: false,
          children: ['theory/typesetting', 'theory/basic', 'theory/color'],
        },
        {
          title: '布局篇',
          collapsable: false,
          children: ['layouts/middle', 'layouts/flexbox', 'layouts/grid'],
        },
      ],
      /** JavaScript 相关 */
      '/javascript/': [
        {
          title: '基础篇',
          children: [
            'utility/lexical-grammar',
            'utility/syntax',
            'ES6/block',
            'utility/javascript-type',
            'utility/javascript-function',
            'utility/javascript-object',
            'utility/javascript-asynchronous',
            'ES6/promise',
            'ES6/async',
            'utility/javascript-runing',
            'utility/memory',
          ],
        },
        {
          title: '应用篇',
          children: ['utility/fp', 'utility/cache', 'utility/module'],
        },
        {
          title: '数据结构和算法',
          children: ['utility/fe-algorithm/data', 'utility/fe-algorithm/array', 'ES6/string', 'ES6/symbol', 'ES6/set_map'],
        },
        {
          title: 'TypeScript',
          children: [
            'typescript/intro',
            'typescript/config-file',
            'typescript/synax',
            'typescript/type-attention',
            'typescript/type-advance',
            'typescript/type-check',
            'typescript/type-declare',
            'typescript/type-programing',
            'typescript/typescript-important',
            'typescript/use-typescript-two-years',
          ],
        },
        {
          title: '网络请求',
          children: ['utility/data-interaction/ajax', 'utility/data-interaction/cross-origin'],
        },
      ],
      // 基础建设和工程化
      '/infrastructure/': ['vscode-code-format', 'babel', 'webpack', 'browserslist', 'need-or-not-comment', 'data-analysis-word-interpretation'],
      // 职业发展
      '/career/': ['plan-2022', 'business-process', 'online-accident'],
      '/frame/vue/': [
        {
          title: 'Vue2源码',
          children: ['vue2/directory-build', 'vue2/constructor', 'vue2/data-view', 'vue2/reactive', 'vue2/computed&watch'],
        },
        {
          title: '框架基础',
          children: ['Virtual-DOM'],
        },
      ],
      '/project/': [
        {
          title: '实践经验',
          collapsable: false,
          children: ['el-scrollbar'],
        },
      ],
      /** H5 相关 */
      '/mobile/': [
        {
          title: 'H5',
          children: ['h5/fit'],
        },
      ],
      /** NodeJS 相关 */
      '/nodejs/': [
        {
          title: '基础',
          children: ['basic', 'record', 'npm', 'path'],
        },
      ],
      /** 网络基础 */
      '/network-basics/': [
        {
          title: 'HTTP',
          collapsable: false,
          children: ['http/into', 'http/basic'],
        },
      ],
      /** 数据存储 */
      '/database/': [
        {
          title: 'MySQL',
          collapsable: false,
          children: ['mysql/mysql'],
        },
      ],
      /** 服务器运维 */
      '/server/': [
        {
          title: 'Linux',
          collapsable: false,
          children: ['linux/computer', 'linux/basics', 'linux/centos'],
        },
        {
          title: 'Shell',
          collapsable: false,
          children: ['shell/basics', 'shell/script'],
        },
        {
          title: 'Nginx',
          collapsable: false,
          children: ['nginx/introduction', 'nginx/install', 'nginx/command', 'nginx/config', 'nginx/static', 'nginx/proxy', 'nginx/tips', 'nginx/advance', 'nginx/process'],
        },
      ],
      /** Git */
      '/git/': [
        {
          title: 'Git 入门',
          collapsable: false,
          children: ['intro', 'workflow', 'theory', 'directory', 'setconfig'],
        },
        {
          title: '命令&实践',
          collapsable: false,
          children: ['command', 'commit'],
        },
      ],
      /** 浏览器 */
      '/browser/': ['browser-work', 'browser-render', 'rerender'],
      /** 方法论 */
      '/method/': [
        {
          title: '高效',
          collapsable: false,
          children: ['efficiency/tomato'],
        },
        {
          title: '洞见',
          collapsable: false,
          children: ['insight/interview', 'insight/decision', 'insight/re-decision'],
        },
      ],
      /** 捡贝壳 */
      '/article/': [
        {
          title: '有趣的文章',
          children: ['book', 'read-book', 'why-read-book', 'soft-skills', 'critical-knowledge', 'seven-thing', 'female', 'zhihu48'],
        },
        {
          title: '有趣的人',
          children: ['year-summary/2019/naibamanong2019'],
        },
        {
          title: '读书笔记',
          children: ['book/xiaogouqianqian', 'book/ganfa'],
        },
        {
          title: '老技术文章备份',
          children: ['oldTechnologyArticle/ThinkPHP_template', 'oldTechnologyArticle/zifubianma', 'oldTechnologyArticle/email'],
        },
      ],

      /**
       * 首页侧边栏
       */
      '/': [
        /** 前端部分 */
        {
          title: '前端',
          collapsable: false,
          children: [
            {
              title: 'HTML',
              collapsable: false,
              path: '/html/global-attr',
            },
            {
              title: 'CSS',
              collapsable: false,
              path: '/css/theory/typesetting',
            },
            {
              title: 'JavaScript',
              collapsable: false,
              path: '/javascript/utility/lexical-grammar',
            },

            {
              title: '基础建设和工程化',
              collapsable: false,
              path: '/infrastructure/vscode-code-format',
            },
            {
              title: '职业发展',
              collapsable: false,
              path: '/career/plan-2022',
            },
          ],
        },
        {
          title: '框架',
          children: [
            {
              title: 'Vue',
              collapsable: false,
              path: '/frame/vue/vue2/directory-build',
            },
          ],
        },
        /** 移动端部分 */
        {
          title: '移动端',
          children: [
            {
              title: 'H5',
              collapsable: false,
              path: '/mobile/h5/fit',
            },
          ],
        },
        /** 服务端部分 */
        {
          title: '服务端',
          collapsable: false,
          children: [
            {
              title: 'NodeJS',
              collapsable: false,
              path: '/nodejs/basic',
            },
            {
              title: '网络基础',
              collapsable: false,
              path: '/network-basics/http/into',
            },
            {
              title: '数据存储',
              collapsable: false,
              path: '/database/mysql/mysql',
            },
            {
              title: '服务器运维',
              collapsable: false,
              path: '/server/linux/computer',
            },
          ],
        },
        /** 开发工具 */
        {
          title: '开发工具',
          children: [
            {
              title: 'Git',
              collapsable: false,
              path: '/git/intro',
            },
            {
              title: '浏览器',
              collapsable: false,
              path: '/browser/browser-work',
            },
          ],
        },
        /** 认知 */
        {
          title: '认知',
          children: [
            {
              title: '技术经验',
              collapsable: false,
              path: '/project/el-scrollbar',
            },
            {
              title: '方法论',
              collapsable: false,
              path: '/method/efficiency/tomato',
            },
          ],
        },
      ],
    },
  },
}
