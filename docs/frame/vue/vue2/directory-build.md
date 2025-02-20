# 【一】Vue2 源码-项目基础和项目构建

> Vue.js 版本为 v2.6.14

## 为什么要读源码

文章开始之前先说一下为什么要读源码？

了解技术实现原理是前端工作的必然要求，而看源码是了解技术实现原理的最直接手法，是高效提升个人技术能力的有效途径

- 首先，优秀的框架源码有助于提升你的 JavaScript 功底，在读源码的过程中可以学习很多 JavaScript 编程技巧，这种贴合实战的学习方式，比天天抱着编程书看效率要高得多
- 其次，提升工作效率，形成学习与成长的良性循环，了解技术的底层实现原理，会让你在工作中对它的应用更加游刃有余，在遇到问题后可以快速定位并分析解决。这样你的工作效率就会大大提升，帮你省出更多的时间来学习和提升
- 再次，借鉴优秀源码的经验，学习高手思路。可以通过阅读优秀的项目源码，了解高手是如何组织代码的，了解一些算法思想和设计模式的应用，甚至培养“造轮子”的能力
- 最后，提升自己解读源码的能力。读源码本身是很好的学习方式，一旦你掌握了看源码的技巧，未来学习其他框架也会容易很多。而且，工作中也可以通过阅读项目已有代码快速熟悉项目，提高业务逻辑分析能力和重构代码的能力

## 项目基础包括：项目结构、架构设计和构建流程。

既然是学习源码，那我们就有必要阅读项目的贡献规则文档，好的开源项目肯定会包含这部分内容，Vue.js 的贡献文档位置在 `.github/CONTRIBUTING.md`, 可以直接访问链接查看具体内容：[https://github.com/vuejs/vue/blob/dev/.github/CONTRIBUTING.md](https://github.com/vuejs/vue/blob/dev/.github/CONTRIBUTING.md)，在这个文档里说明了一些行为准则、PR 指南、Issue Reporting 指南、Development Setup 以及项目结构。通过阅读这些内容我们可以了解项目如何开发和启动以及目录说明。

## 项目目录

Vue.js 的目录结构如下：

```
├── scripts                    # 与构建相关的脚本和配置文件，一般情况下我们不需要动。不过熟悉下面两个文件会有帮助
    ├── alias.js               # 模块引入时的别名
    ├── config.js              # dist文件夹中构建好的文件可以在这里查看源文件的配置
├── dist                       # 构建后的文件输出目录
├── flow                       # Flow的类型声明
├── packages                   # vue-server-renderer 和 vue-template-compiler 等，它们作为单独的 NPM 包发布
├── test                       # 包含所有的测试代码
├── src                        # 最应该关注的目录，包含了源码
    ├── compiler               # 与模板编译相关的代码，将 template 编译为 render 函数
        ├── parser             # 包含将模板字符串转换成抽象语法树（AST）的代码
        ├── codegen            # 包含从抽象语法树（AST）生成render函数的代码
        ├── optimizer.js       # 分析静态树，优化vdom渲染
    ├── core                   # 核心代码，通用的，与平台无关的运行时代码
        ├── observer           # 反应系统，包含数据观测的核心代码
        ├── vdom               # 包含虚拟DOM创建（creation）和打补丁（patching）的代码
        ├── instance           # Vue.js实例的构造函数和原型方法
        ├── global-api         # 包含给Vue构造函数挂载全局方法（静态方法）或属性的代码
        ├── components         # 通用的抽象组件
        ├── util               # 通用的工具方法
    ├── server                 # 包含服务端渲染（server-side rendering）的相关代码
    ├── platforms              # 特定平台代码
    ├── sfc                    # 单文件组件（*.vue文件）解析逻辑，用于vue-template-compiler包
    ├── shared                 # 整个项目的公用工具代码
├── types                      # TypeScript 类型定义
    ├── test                   # 类型定义测试
```

### packages

`packages` 目录中包含的 vue-server-renderer 和 vue-template-compiler 会作为单独的 NPM 包发布，自动从源码中生成，并且始终与 Vue.js 具有相同的版本。

### compiler

`src/compiler` 目录包含 Vue.js 所有编译相关的代码。它包括把模板解析成抽象语法树（AST），抽象语法树优化，代码生成等功能。

编译工作可以在构建时做（借助 webpack、vue-loader 等辅助）；也可以在运行时做，使用包含编译功能的 Vue.js。显然，编译是一项耗性能的工作，所以更推荐前者——离线编译。

### core

`src/core` 目录下是 Vue.js 的核心代码，包括内置组件、全局 API 封装，Vue 实例化、观察者、虚拟 DOM、工具函数等，这部分逻辑是与平台无关的，也就是说，他们可以在任何 JavaScript 环境下运行，比如浏览器、Node.js 或者嵌入到原生应用中。

### platforms

`src/platforms` 目录中包含特定平台的代码，跨平台相关的代码也会放在这里。

Vue.js 是一个跨平台的 MVVM 框架，它可以跑在 web 上，也可以配合 weex 跑在 native 客户端上。platforms 是 Vue.js 的入口，2 个目录代表 2 个主要入口，分别打包成运行在 web 上的和 weex 上的 Vue.js。

### server

Vue.js 2.0 支持了服务端渲染，所有服务端渲染相关的逻辑都在这个 `src/server` 目录下。注意：这部分代码是跑在服务端的 Node.js，不要和跑在浏览器端的 Vue.js 混为一谈。

服务端渲染主要的工作是把组件渲染为服务端的 HTML 字符串，将它们直接发送到浏览器，最后将静态标签“混合”为客户端上完全交互的应用程序。

### sfc

通常我们开发 Vue.js 都会借助 webpack，然后通过 .vue 单文件来编写组件。

`src/sfc` 目录下的代码逻辑会把 .vue 文件内容解析成一个 JavaScript 对象。

### shared

`src/shared` 目录下存放 Vue.js 定义的一些工具方法，这里定义的工具方法是会被浏览器端的 Vue.js 和服务端的 Vue.js 所共享的。

### 总结

从 Vue.js 的目录设计可以看到，作者把功能模块拆分的非常清楚，相关的逻辑放在一个独立的目录下维护，并且把复用的代码也抽成了一个目录。这样的目录设计让代码的阅读性和可维护性都变强了。

## 架构设计

Vue.js 的整体结构分为三部分：核心代码、跨平台相关和公用工具函数（一些辅助函数）。同时架构是分层的，最底层是一个普通的构造函数，最上层是一个入口，也就是将一个完整的构造函数导出给用户使用。在最底层和最顶层中间，逐渐增加一些方法和属性。

从最底层的普通构造函数往上一层，会在构造函数的 prototype 上添加一些方法，例如 init 相关的 `Vue.prototype._init` 、state 相关的 `Vue.prototype.$data` 等、events 相关的 `Vue.prototype.$on` 等、lifecycle 相关的`Vue.prototype._mount` 等。

再往上一层会在构造函数本身添加一些方法，例如 Vue.use 、 Vue.nextTick 等，这些方法叫做全局 API（Global API）。

再往上一层是与跨平台相关的内容。在构建时，首先会选择一个平台（Web 或者 Weex），然后将特定于这个平台的代码加载到构建文件中。

再往上一层是渲染层，其中包含两部分内容：服务端渲染相关的内容和编译器相关的内容，同时，这一层的内容也是可选的，构建时会根据构建的目标文件来选择是否需要将编译器加载进来。这一层只是一个笼统的归类，因为服务端渲染相关的代码只存在于 Web 平台下，而且 Web 平台和 Weex 平台有各自的编译器配置，考虑到都是与渲染相关的内容，在这里归到了一层。

最顶层是入口，对于 Vue.js 源码来说是出口，对于构建工具和 Vue.js 的使用者来说，是入口。在构建文件时，不同平台的构建配置会选择不同的入口进行构建操作。

## Vue.js 的构建过程

Vue.js 源码是基于 Rollup 构建的，它的构建相关配置都在 scripts 目录下。

### 构建脚本

在项目 package.json 文件中的 script 字段，我们可以看到 Vue.js 源码构建的脚本如下：

```json
{
  "script": {
    "build": "node scripts/build.js",
    "build:ssr": "npm run build -- web-runtime-cjs,web-server-renderer",
    "build:weex": "npm run build -- weex"
  }
}
```

这里总共有三条命令，作用都是构建 Vue.js，后面 2 条是在第一条命令的基础上，增加一些环境参数。当运行 `npm run build` 的时候，实际上就会执行 `node scripts/build.js` 。

### 构建过程

在 `scripts/build.js`中主要逻辑如下：

```js
// 从配置文件读取配置，然后通过命令行参数对构建配置做过滤，这样就能构建出不同用途的 Vue.js
let builds = require('./config').getAllBuilds()

// filter builds via command line arg
if (process.argv[2]) {
  const filters = process.argv[2].split(',')
  builds = builds.filter((b) => {
    return filters.some((f) => b.output.file.indexOf(f) > -1 || b._name.indexOf(f) > -1)
  })
} else {
  // filter out weex builds by default
  builds = builds.filter((b) => {
    return b.output.file.indexOf('weex') === -1
  })
}

build(builds)
```

配置文件在 `scripts/config.js` 中，简单列举 web 相关的，其他的服务端渲染插件和 weex 的就不列举了。

```js
const builds = {
  // Runtime only (CommonJS). Used by bundlers e.g. Webpack & Browserify
  'web-runtime-cjs': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.common.js'),
    format: 'cjs',
    banner,
  },
  // Runtime+compiler CommonJS build (CommonJS)
  'web-full-cjs': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.common.js'),
    format: 'cjs',
    alias: { he: './entity-decoder' },
    banner,
  },
  // Runtime only (ES Modules). Used by bundlers that support ES Modules,
  // e.g. Rollup & Webpack 2
  'web-runtime-esm': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.esm.js'),
    format: 'es',
    banner,
  },
  // Runtime+compiler CommonJS build (ES Modules)
  'web-full-esm': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.esm.js'),
    format: 'es',
    alias: { he: './entity-decoder' },
    banner,
  },
  // runtime-only build (Browser)
  'web-runtime-dev': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.js'),
    format: 'umd',
    env: 'development',
    banner,
  },
  // runtime-only production build (Browser)
  'web-runtime-prod': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.min.js'),
    format: 'umd',
    env: 'production',
    banner,
  },
  // Runtime+compiler development build (Browser)
  'web-full-dev': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.js'),
    format: 'umd',
    env: 'development',
    alias: { he: './entity-decoder' },
    banner,
  },
  // Runtime+compiler production build  (Browser)
  'web-full-prod': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.min.js'),
    format: 'umd',
    env: 'production',
    alias: { he: './entity-decoder' },
    banner,
  },
  // ……
}
```

配置文件中的每一项，都是遵循 Rollup 的构建规则的。其中 `entry` 属性表示构建的入口 JS 文件路径， `dest` 属性表示构建后的 JS 文件路径。 `format` 属性表示构建的格式， `cjs` 表示构建出来的文件遵循 CommonJS 规范，`es`表示构建出来的文件遵循 ES Module 规范。`umd`表示构建出来的文件遵循 UMD 规范。

以 `web-full-cjs` 为例，它的 `entry` 是 `resolve('web/entry-runtime-with-compiler.js')`, `resolve` 函数也是定义在 `scripts/config.js` 中的：

```js
/**
 * scripts/alias.js
 */
const path = require('path')
// 此处的resolve方法就很简单了，回到根目录然后拼接后面的路径
const resolve = (p) => path.resolve(__dirname, '../', p)

module.exports = {
  vue: resolve('src/platforms/web/entry-runtime-with-compiler'),
  compiler: resolve('src/compiler'),
  core: resolve('src/core'),
  shared: resolve('src/shared'),
  web: resolve('src/platforms/web'),
  weex: resolve('src/platforms/weex'),
  server: resolve('src/server'),
  entries: resolve('src/entries'),
  sfc: resolve('src/sfc'),
}

/**
 * scripts/config.js
 */
const aliases = require('./alias') // 获取 alias 配置
const resolve = (p) => {
  // 将传入的p通过 / 分割成数组，然后取数组第一个元素设置为base，例如 p 是 web/entry-runtime-with-compiler.js ， base就是web。
  const base = p.split('/')[0]
  // 判断 base是否在 alias 配置列表中，如果在，就将alias配置中的别名真实路径拼接上文件路径，例如当前的文件 /entry-runtime-with-compiler.js
  // 此时 web 别名的真实路径拼上文件路径为：src/platforms/web/entry-runtime-with-compiler.js
  if (aliases[base]) {
    return path.resolve(aliases[base], p.slice(base.length + 1))
  } else {
    return path.resolve(__dirname, '../', p)
  }
}
```

这样我们就找到了 `web-full-cjs` 配置的入口文件：`src/platforms/web/entry-runtime-with-compiler.js`，它经过 Rollup 构建打包后，最终会在 `dist` 目录下生成 `vue.common.js` 。

上面是以构建 Web 平台下运行的文件为例，我们构建的是完整版本，那么会选择 Web 平台的入口文件开始构建，这个入口文件最终会导出一个 Vue 构造函数。在导出之前，会向 Vue 构造函数中添加一些方法，其流程是：先向 Vue 构造函数的 prototype 属性上添加一些方法，然后向 Vue 构造函数自身添加一些全局 API，接着将平台特有的代码导入进来，最后将编译器导入进来，最终将所有代码同 Vue 构造函数一起导出去。

## Vue.js 构建版本

dist 文件夹存放构建后的文件，在这个目录下你会找到很多不同的 Vue.js 构建版本。

| 构建版本                     | UMD                | CommonJS              | ES Module          |
| ---------------------------- | ------------------ | --------------------- | ------------------ |
| 完整版                       | vue.js             | vue.common.js         | vue.esm.js         |
| 只包含运行时版本             | vue.runtime.js     | vue.runtime.common.js | vue.runtime.esm.js |
| 完整版（生产环境）           | vue.min.js         |                       |                    |
| 只包含运行时版本（生产环境） | vue.runtime.min.js |                       |                    |

- 完整版：构建后的文件同时包含**编译器（compiler）**和**运行时（runtime）**
  - 编译器：负责将模板字符串编译成 JavaScript 渲染函数。
  - 运行时：负责创建 Vue 实例，渲染视图和使用虚拟 DOM 实现重新渲染，基本上包含除编译器外的所有部分。
- UMD：UMD 版本的文件可以通过 `<script>` 标签直接在浏览器中使用。一般 CDN 提供的在线引入的 Vue.js 的地址，就是运行时+编译器的 UMD 版本。
- CommonJS：CommonJS 版本用来配合较旧的打包工具，比如 Browserify 或 webpack 1，这些打包工具的默认文件（pkg.main）只包含运行时的 CommonJS 版本（vue.runtime.common.js）。
- ES Module：ES Module 版本用来配合现代打包工具，比如 webpack2 或 Rollup，这些打包工具的默认文件（pkg.main）只包含运行时的 ES Module 版本（vue.runtime.esm.js）。

完整版和只包含运行时的版本区别在于是否需要在客户端编译模板，即是否要处理字符串的 template，如果需要，就用到编译器，就需要完整版。

通常我们利用 vue-cli 去初始化我们的 Vue.js 项目的时候会询问我们用 Runtime Only 版本还是 Runtime + Compiler 版本。就是上面说的只包含运行时的版本和完整版。

我们在使用 Runtime Only 版本时，通常需要借助如 webpack 的 vue-loader 工具把.vue 文件编译成 JavaScript，因为是在编译阶段做的，所以只包含运行时的 Vue.js 代码，因此代码体积也会更轻量。

如果没有对代码做预编译，而且又使用了 template 属性并传入一个字符串，就需要用完整版在客户端编译模板。最终 template 属性会被编译成 render 函数。很显然，编译过程对性能会有一定损耗，所以通常更推荐使用 Runtime Only 的 Vue.js。

## 参考文档

- [Vue2.1.7 源码学习](http://hcysun.me/2017/03/03/Vue%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/#%E4%B8%80%E3%80%81%E4%BB%8E%E4%BA%86%E8%A7%A3%E4%B8%80%E4%B8%AA%E5%BC%80%E6%BA%90%E9%A1%B9%E7%9B%AE%E5%85%A5%E6%89%8B)
- [Vue.js 源码目录设计](https://ustbhuangyi.github.io/vue-analysis/v2/prepare/directory.html)
- [《深入浅出 Vue.js》](https://item.jd.com/12573168.html)
