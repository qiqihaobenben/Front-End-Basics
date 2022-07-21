# 认识 browserslist

[browserslist](https://github.com/browserslist/browserslist) 定义了一套浏览器兼容配置标准，可以让众多前端开发工具之间可以共享一套配置。

支持的前端开发工具列表：

- Autoprefixer
- Babel
- postcss-preset-env
- eslint-plugin-compat
- stylelint-no-unsupported-browser-features
- postcss-normalize
- obsolete-webpack-plugin

## browserslist 相关工具

- [browserslit-ga](https://github.com/browserslist/browserslist-ga) 和 [browserslist-ga-export](https://github.com/browserslist/browserslist-ga-export) ： 该工具能生成访问你运营的网站的浏览器的版本分布数据，以便用于类似 `0.5% in my stats` 查询条件，前提是你运营的网站部署有 Google Analytics。
- [browserslist-useragent-regexp](https://github.com/browserslist/browserslist-useragent-regexp) ： 将 browserslist 查询编译为 regexp 以测试浏览器 useragent。可以用于展示“暂不支持你的浏览器”等信息。
- [browserslist-useragent-ruby](https://github.com/browserslist/browserslist-useragent-ruby) ： 功能同上，是一个 Ruby 库。
- [caniuse-api](https://github.com/Nyalab/caniuse-api) ：请求 caniuse 数据检查浏览器的兼容性。
- `npx browserslist` ： 在前端工程目录下运行此命令，可以输出当前工程的目标浏览器列表。

其他的工具介绍可以查看[官方文档](https://github.com/browserslist/browserslist#tools)

## browserslist 配置文件和查询顺序

1. 工具自身的配置，例如 Autoprefixer 工具配置中的 browsers 属性
2. **当前目录或者上级目录的 `package.json` 配置文件里面的 `browserslist` 配置项（推荐）**
3. 当前目录或者上级目录的 `.browserslistrc` 配置文件
4. 当前目录或者上级目录的 `browserslist` 配置文件
5. `BROWSERSLIST` 环境变量
6. 如果以上配置均不能提供一个有效的配置，browserslist 将采用默认配置：`> 0.5%, last 2 versions, Firefox ESR, not dead`

```json
// package.json
// 默认配置：> 0.5%, last 2 versions, Firefox ESR, not dead
"browserslist": ["defaults"]
```

### 配置区分环境

browserslist 可以通过 `BROWSERSLIST_ENV` 或者 `NODE_ENV` 选择使用哪些配置，如果这两个环境变量都没指定，那就首先看一下有没有 `production` 这个环境配置，如果 `production` 环境也没有，就直接使用 `defaults` 配置。

例如 `package.json` 中：

```
  "browserslist": {
    "production": [
      "> 1%",
      "ie 10"
    ],
    "modern": [
      "last 1 chrome version",
      "last 1 firefox version"
    ],
    "ssr": [
      "node 12"
    ]
  }
```

在 `.browserslistrc` 中：

```
[production]
> 1%
ie 10

[modern]
last 1 chrome version
last 1 firefox version

[ssr]
node 12
```

## 具体参数

browserslist 的配置内容可以理解为一个查询集合，根据这个集合来定制我们项目的兼容范围

- `defaults` ： 默认支持的浏览器 (`> 0.5%, last 2 versions, Firefox ESR, not dead`)
- 统计范围相关
  - `> 5%` ： 兼容全球浏览器使用数量占比 5% 以上的类型。数值可以根据实际场景自定义，同理，除了 `>` 也支持 `>=`、`<`、`<=`。
  - `> 5% in US` ：指定国家使用率覆盖（双字母构成，例如 `CH`、`JP` 等等）
  - `> 5% in alt-AS` ： 指定大洲的使用覆盖率（双字母后缀，例如 `alt-af`、`alt-as` 等等）
  - `> 5% in my stats` ： 自己网站的使用覆盖率，需要结合 `browserslist-ga-export`
  - `cover 99.5%` ： 覆盖全球 99.5% 的浏览器类型，即支持绝大多数的现代浏览器。
  - `cover 99.5% in US` ： 与前面同理。
  - `cover 99.5% in my stats` ： 与前面同理。
- 最近版本
  - `last 2 versions` ： 每个浏览器支持的最新 2 个版本
  - `last 2 Chrome versions` ： Chrome 浏览器支持的最新 2 个版本
  - `last 2 major versions` ： 每个浏览器支持的最新 2 个主分支版本
- Node 版本
  - `maintained node versions` ： 兼容所有仍被支持的 NODE 版本
  - `node 10 and node 10.4` ： 兼容 `10.x.x` 或 `10.4.x` 版本
  - `current node` ： 兼容当前环境下的 NODE 版本
- 浏览器版本
  - `ie 6-8` ： 设置兼容 IE 版本范围
  - `not ie <= 8` ： 设置不支持的 IE 版本范围
  - `Firefox > 20` ： 设置火狐的版本范围，同理也支持 `>=`、`<` 及 `<=`。
  - `Firefox ESR` ： 火狐延长支持板的最新版本
  - `iOS 7` ： 设置支持的 iOS 7 浏览器版本
- `last 2 years` ： 最近 2 年发布的浏览器版本
- `since 2015` ： 自 2015 年发布的浏览器版本
- `unreleased versions` 或 `unreleased Chrome versions` ：alpha 和 beta 版本
- `extends browserslist-config-mycompany` ：从 browserslist-config-mycompany 中继承配置。
- `dead` ： 一年内未被官方维护更新的版本，到现在为止是 `IE 11`, `IE_Mob 11`, `BlackBerry 10`, `BlackBerry 7`, `Samsung 4`, `OperaMobile 12.1` 和所有版本的 `Baidu`

**在所有的查询条件前都可以添加 `not` 取非，例如 `not dead`。并且条件可以进行集合操作，通过 `or` 或 `,` 进行并集操作，通过 `and` 进行交集操作，`not` 去非包含关系集合。具体查询组合效果可以查看[官方文档](https://github.com/browserslist/browserslist#query-composition)**
