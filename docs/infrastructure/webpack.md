# Webpack 备忘

Webpack 是现代化前端开发的基石，也是目前前端生产力的代名词。Webpack 以模块化思想为核心，帮助开发者更好的管理整个前端工程。

Webpack 想要实现的是整个前端项目的模块化，项目中的各种资源（包括 CSS 文件和图片等）都应该属于被管理的模块。换句话说，Webpack 不仅仅是 JavaScript 模块打包工具，还是整个前端项目（前端工程）的模块打包工具，我们可以通过 Webpack 管理前端项目中任何类型的资源文件。

npx 是 npm 5.2 以后新增的一个命令，可以用来更方便的执行远程模块或者项目 node_modules 中的 CLI 程序。

Webpack 4 以后的版本支持零配置的方式直接启动打包，整个过程会按照约定将 src/index.js 作为打包入口，最终打包的结果会存放在 dist/main.js 中。

## loader

```
...
module: {
  rules: [
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }
  ]
}
...
```

css-loader 只会把 CSS 模块加载到 JavaScript 代码中，而并不会使用这个模块。还需要在 css-loader 的基础上再使用一个 style-loader，把 css-loader 转换后的结果通过 style 标签追加到页面上。一旦一个规则配置多个 loader，执行顺序是从后往前执行的，所以一定要将 css-loader 放在最后，因为必须要 css-loader 先把 CSS 代码转换为 JavaScript 模块，才可以正常打包。style-loader 的作用总结一句话就是，将 css-loader 中所加载到的所有样式模块，通过创建 style 标签的方式添加到页面上。

Webpack 加载资源文件的过程类似于一个工作管道，你可以在这个过程中依次使用多个 loader，第一个 loader 接受到的是文件的源码，后面的会依次接收到上一个 loader 的处理结果，但是最终这个**管道结束之后的结果必须是一段标准的 JavaScript 代码字符串**。

### loader 的传参

#### querystring 传参

```
{
  test: /\.css$/,
  use: [
    'style-loader',
    'css-loader?modules'
  ]
}
```


#### 对象传参

```
{
  test: /\.css$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        modules: true
      }
    }
  ]
}
```



## plugin

Webpack 插件机制的目的是为了增强 Webpack 在项目自动化构建方面的能力。loader 就是负责完成项目中各种各样资源模块的加载，从而实现整体项目的模块化，而 plugin 则是用来解决项目中除了资源模块打包以外的其他自动化工作。

应用场景：

- 实现自动在打包之前清除 dist 目录（上次的打包结果）
- 自动生成应用所需要的 HTML 文件
- 根据不同环境为代码注入类似 API 地址这种可能变化的部分
- 拷贝不需要参与打包的资源文件到输出目录
- 压缩 Webpack 打包完成后输出的文件
- 自动发布打包结果到服务器实现自动部署

Webpack 的插件机制是钩子机制。即插件都是通过往 Webpack 生命周期的钩子中挂载任务函数实现的。

Webpack 要求我们插件必须是一个函数或者是一个包含 apply 方法的对象，这个 apply 会在 Webpack 启动时被调用，它接收一个 compiler 对象参数，这个对象是 Webpack 工作过程中最核心的对象，里面包含了构建的所有配置信息，钩子函数也是通过这个对象注册的。

## Webpack 核心工作过程

以普通的前端项目为例，项目中一般都会散落着各种各样的代码及资源文件，比如 JS、CSS、图片、字体等，这些文件在 Webpack 思想中都属于当前项目中的一个模块，Webpack 可以通过打包，将它们最终聚集到一起。

具体来看打包的过程，Webpack 启动后，会根据我们的配置（entry），找到项目的某个指定文件（一般这个文件都会是一个 JavaScript 文件）作为入口。然后顺着入口文件中的代码，根据代码中出现的 import（ES Modules）或者是 require（CommonJS）之类的语句，解析推断出来这个文件所依赖的资源模块，然后再分别去解析每个资源模块的依赖，周而复始，最后形成整个项目中所有用到的文件之间的依赖关系树。

有了这个依赖关系树后，Webpack 会遍历（递归）这个依赖树，找到每个节点对应的资源文件，然后根据配置选项中的 loader 配置，交给对应的 loader 去加载这个模块，最后将加载的结果放入 bundle.js（打包结果中），从而实现整个项目的打包。在整个流程中，Webpack 会在恰当的时机执行 Plugin 里定义的逻辑。

对于依赖模块中无法通过 JavaScript 代码表示的资源模块，例如图片或字体文件，一般的 loader 会将它们单独作为资源文件拷贝到输出目录中，然后将这个资源文件所对应的访问路径作为这个模块的导出成员暴露给外部。

整个打包过程中，loader 机制起到了很重要的作用，因为如果没有 loader 的话，Webpack 就无法实现各种各样类型的资源文件加载，那 Webpack 也就只能算是一个用来合并 JS 模块代码的工具了。

至于自定义插件机制，它并不会影响 Webpack 的核心工作过程，只是为 Webpack 提供一个强大的扩展能力，它为整个工作过程的每个环节都预置了一个钩子，也就是说我们可以通过插件往 Webpack 工作过程的任意环节植入一些自定义的任务，从而扩展 Webpack 打包功能之外的能力。

### 从代码的视角看

- Webpack CLI 启动打包流程；
- 载入 Webpack 核心模块，创建 Compiler 对象；
- 使用 Compiler 对象开始编译整个项目；
- 从入口文件开始，解析模块依赖，形成依赖关系树；
- 递归依赖关系树，将每个模块交给对应的 loader 处理；
- 合并 loader 处理完的结果，将打包结果输出到 dist 目录；
- Webpack 插件将作用在整个工作过程中，通过每个环节的钩子来执行自定义任务。

## devtool

![](./images/webpack-1.png)

- 带有 source-map ：生成 Source Map 文件，可以定位具体的行列信息。
- 带有 cheap : 生成 Source Map 文件，但是只能定位到行，而定位不到列，构建速度会提升很多。
- 带有 module ：定位的源代码是没有经过 loader 加工的，也就是说跟我们写的源代码是一模一样的，没有经过转换。

开发环境建议选择 cheap-module-eval-source-map。生产环境选择 none，或者 nosources-source-map 模式。

Source Map 并不是 Webpack 特有的功能，它们两者的关系只是：Webpack 支持 Source Map。大多数的构建或者编译工具也都支持 Source Map。

## webpack-dev-server

运行 webpack-dev-server 这个命令时，它内部会启动一个 HTTP Server，为打包的结果提供静态文件服务，并且自动使用 Webpack 打包我们的应用，然后监听源代码的变化，一旦文件发生变化，它会立即重新打包。不过这里需要注意的是，webpack-dev-server 为了提高工作效率，它并没有将打包结果写入到磁盘中，而是暂时存放在内存中，内部的 HTTP Server 也是从内存中读取这些文件的，这样一来，就会减少很多不必要的磁盘读写操作，大大提高了整体的构建效率。

## Tree-shaking

Tree-shaking 并不是指 Webpack 中的某一个配置选项，而是一组功能搭配使用过后实现的效果，这组功能在生产模式下都会自动启动，所以使用生产模式打包就会有 Tree-shaking 的效果。

开启 Tree-shaking

- 在配置对象中添加一个 optimization 属性，这个属性用来集中配置 Webpack 内置优化功能，它的值也是一个对象。
- 在 optimization 对象中先开启一个 usedExports 选项，表示在输出结果中只导出外部使用了的成员
- 在 optimization 对象中开启 minimize，用来压缩输出结果，这样那些未引用代码（dead-code）就会被移除
- 在 optimization 对象中开启 concatenateModules，可以尽可能将所有模块合并到一起输出到一个函数中，这样既提升了运行效率，又减少了代码的体积。这个特性又被称为 Scope Hoisting ，也就是作用域提升，它是 Webpack 3.0 中添加的一个特性。

## sideEffects

Webpack4 中新增了一个 sideEffects 特性，允许我们通过配置标识我们的代码是否有副作用，从而提供更大的压缩空间。模块的副作用指的就是模块执行的时候除了导出成员，是否还做了其他的事情，这个特性一般只有我们去开发一个 npm 模块时才会用到。

那些没有导出的成员由于所属的模块中有副作用代码，就会导致最终 Tree-shaking 过后，这些模块并不会被完全移除。Tree-shaking 只能移除没有用到的代码成员，而想要完整移除没有用到的模块，那就需要开启 sideEffects 特性了。

是 sideEffects 生效需要两步

- 在 optimization 中开启 sideEffects 特性，这个特性在 production 模式下同样会自动开启。
- 在 package.json 中的 sideEffects 标识我们的代码没有副作用。此处可以使用 true，或者模块路径的数组

此时 Webpack 在打包某个模块之前，会先检查这个模块所属的 package.json 中的 sideEffects 标识，以此来判断这个模块是否有副作用，如果没有副作用的话，这些没用到的模块就不再被打包，换句话说，即使这些没有用到的模块中存在一些副作用代码，我们也可以通过 package.json 中的 sideEffects 去强制声明没有副作用。

### 注意

使用 sideEffects 这个功能的前提是确定你的代码没有副作用，或者副作用代码没有全局影响，否则打包时就会误删掉那些有意义的副作用代码。比如给全局的 Array 对象扩展了一个原型方法。

总结一下：对全局有影响的副作用代码的模块不能移除，而副作用代码只是对模块有影响的，那么这个模块就可以移除。

## 打包代码的权衡

没有经过打包的代码很零碎，直接按照开发过程中划分的模块颗粒度进行加载，那么运行一个小小的功能，就需要加载非常多的资源模块，在目前主流 HTTP1.1 本身就存在一些缺陷：

- 同一个域名下的并行请求是有限制的；
- 每次请求本身都会有一定的延迟；
- 每次请求除了传输内容，还有额外的请求头，大量请求的情况下，这些请求头加在一起也会浪费流量和带宽

综上所述，模块打包肯定是必要的，但是当应用体积越来越大时，ALL in One 的方式并不合理，我们也要学会变通，更为合理的方案是把打包的结果按照一定的规则分离到多个 bundle 中，然后根据应用的运行需要按需加载，这样可以降低启动成本，提高响应速度。

### Code Splitting

为了解决打包结果过大导致的问题，Webpack 设计了一种分包功能：Code Splitting（代码分割）。

Code Splitting 通过把项目的资源模块按照我们设计的规则打包到不同的 bundle 中，从而降低应用的启动成本，提高响应速度。

Webpack 实现分包的方式主要有两种：

- 根据业务不同配置多个打包入口，输出多个打包结果
- 结合 ES Modules 的动态导入（Dynamic Imports）特性，按需加载模块

#### 多入口打包

多入口打包一般适用于传统的多页应用程序，最常见的划分规则就是一个页面对应一个打包入口。对于不同页面间的公用部分，再提取到公共的结果中。

1. 一般配置文件中的 entry 属性只会配置一个打包入口，如果我们需要配置多个入口，可以把 entry 定义成一个对象。注意：这里的 entry 是定义为对象而不是数组，如果是数组的话就是多个文件打包到一起，还是一个入口。
2. 一旦入口配置为多入口形式，那输出文件名也需要修改，可以使用 `[name]` 这种占位符来输出动态的文件名，`[name]` 最终会被替换为入口的名称。
3. 除此之外，配置中还需要通过 html-webpack-plugin 配置对应的 HTML 文件，然后通过每个页面配置的 chunks 属性来设置页面使用的 bundle。
4. 提供公共模块，在 optimization 中开启 splitChunks，这是一个对象，对象中配置 `chunks: 'all'` 就可以自动提取所有公共模块到一个公共 bundle 中，在 html-webpack-plugin 配置的 chunks 中加入这个公共的 bundle 即可。

#### 动态导入

Code Splitting 最常见的实现方式还是结合 ES Modules 的动态导入特性，从而实现按需加载。

Webpack 中支持使用动态导入的方式实现模块的按需加载，而且所有动态导入的模块都会被自动提取到单独的 bundle 中，从而实现分包。

为了动态导入模块，可以将 import 关键字作为函数调用。当以这种方式使用时，import 函数返回一个 Promise 对象。这就是 ES Modules 标准中的 [Dynamic Imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)。

默认通过动态导入产生的 bundle 文件，它的 name 就是一个序号，这并没有什么不好，因为大多数时候，在生产环境中我们根本不用关心资源文件的名称，但是如果还需要给这些 bundle 命名的话，就可以使用 Webpack 所特有的魔法注释去实现。所谓的魔法注释，就是在 import 函数的传参位置前，添加一个行内注释。这个注释有一个特定的格式 `/* webpackChunkName: '' */`，这样就可以给分包的 chunk 起名字了。

```js
// 魔法注释

import(/* webpackChunkName: 'posts' */ './posts/posts').then(({ default: posts }) => {
  mainElement.appendChild(posts())
})
```

魔法注释还有个特殊用途：如果你的 chunkName 相同的话，那相同的 chunkName 最终会被打包到一起。

## 其他打包工具比较

### Rollup

Rollup 的初衷是希望能够提供一个高效的 ES Modules 打包器，充分利用 ES Modules 的各种特性，构建出结构扁平，性能出众的类库。

#### 优点

- 输出结果更加扁平，执行效率更高
- 自动移除未使用代码
- 打包结果依然完全可读

#### 缺点

- 加载非 ESM 的第三方模块比较复杂
- 因为模块最终都被打包到全局中，所以无法实现 HMR
- 浏览器环境中，代码拆分功能必须使用 Require.js 这样的 AMD 库进行支持

基本原则：应用开发使用 Webpack，类库或者框架开发使用 Rollup。

### Parcel

Parcel 是一款完全零配置的前端打包器。虽然 Parcel 跟 Webpack 一样都支持以任意类型的文件作为打包入口，不过 Parcel 官方还是建议我们使用 HTML 文件作为入口，理由是 HTML 是应用在浏览器端运行时的入口。

特点：

- 真正做到了完全零配置，对项目没有任何的侵入
- 自动安装依赖，开发过程更专注
- 构建速度更快，因为内部使用了多进程同时工作，能够充分发挥多核 CPU 的效率

但是大多数项目依然选择 Webpack 可能的原因：

- Webpack 生态更好，扩展更丰富，出现问题容易解决
- 随着时间的发展，Webpack 越来越好用，开发者也越来越熟悉

### Bundleless 系列

Bundleless 本质上是将原先 Webpack 中模块依赖解析的工作交给浏览器去执行，使得在开发过程中代码的转换变少，极大地提升了开发过程中的构建速度。

所有的工具肯定都有一个共同的目标：改善开发者体验，提高开发效率。

- [ESBuild & SWC 浅谈: 新一代构建工具](https://mp.weixin.qq.com/s/9VaUq9FOm2_nKNCGaH-7rw)
