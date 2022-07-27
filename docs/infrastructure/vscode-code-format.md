# 前端代码规范和编码风格详解

本文以 VS Code 编辑器为例展开，可以搭配 [vscode-linter-example](https://github.com/qiqihaobenben/vscode-linter-example) 这个例子对照着实践一下。

## VS Code 编辑器自身配置

VS Code 的配置有三种形式：全局默认配置、用户配置、工作区配置。

- 全局默认配置：VS Code 在安装完成后，在安装目录会有一个 `settings.json` 配置文件。
- 用户配置：对应的是软件目录中跟当前用户相关联的特定文件夹中的 `settings.json` 配置文件（类似于 macOS 中 $HOME/Library/Application Support/Code/User/settings.json），用户配置在所有打开窗口都生效。通过 `ctrl/cmd + ,` 打开的设置就是用户配置 `settings.json` 的 UI 视图。
- 工作区配置：也称项目配置，此时的 `settings.json` 存放于项目所在根目录的 `.vscode` 文件中，当项目在 VS Code 中打开时，仅针对当前项目打开的窗口生效。

这三种形式的配置优先级：项目配置 > 用户配置 > 全局默认配置。

如果存在多种配置，那么优先级高的会覆盖优先级低的，这样的好处是可以为不同项目、不同用户做不同配置，而不会相互干扰，并且项目配置特定于项目，方便开发人员之间共享，达到统一开发环境和编码风格的目的。

### VS Code 的 `.vscode` 文件夹

项目根目录中的`.vscode` 文件夹，除了存放项目配置，还有其他的配置。

`.vscode` 文件夹下包含的配置：

- `settings.json`
- `extensions.json`
- `tasks.json`
- `launch.json`

### `settings.json`

可以在这个项目配置文件中利用编辑器自身默认格式化程序来进行编码风格统一，这也是最基本的格式化。

#### 常用配置

```json
{
  "editor.formatOnSave": true, //保存时自动格式化代码
  // 根据打开文件的内容自动检测缩进，会覆盖默认缩进设置，相关设置： #editor.tabSize#和#editor.intertSpaces#
  // 例如虽然下面设置的 tabSize 为 4，但是当前文件打开时是文件内容的 tabSize 为 2，所以依然会沿用 2，如果设置为 false，后续的 tabSize 则会使用 4
  "editor.detectIndentation": false,
  "editor.insertSpaces": true, //是否使用空格
  "editor.tabSize": 4, // 空格或者制表符的大小
  "editor.fontSize": 14, // 编辑器字体大小
  "editor.rulers": [80, 100], // 垂直标尺，会在指定列号处显示竖线
  "editor.wordWrap": "wordWrapColumn", // 控制换行方式
  "editor.wordWrapColumn": 100 // 控制换行的宽度
}
```

#### 屏蔽文件

项目开发中，有些生成的中间文件或者有一些不希望项目普通开发者改动的配置文件等，就可以在 `settings.json` 中配置，屏蔽这些文件。

```json
{
  // 搜索文件时不希望查找的文件
  "search.exclude": {
    "**/node_modules": true,
    "**/bower_components": true,
    "**/*.code-search": true
  },
  // 不想展示的文件
  "files.exclude": {
    "**/.git": true,
    "**/build": true,
    "**/deploy.sh": true
  }
}
```

#### 其他配置

```json
{
  // 额外补充一下，VS Code 默认支持 TS，并且可以切换使用项目安装的 TypeScript 版本提供的语法解析和类型检测服务
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

### `extensions.json`

后续会用到的 eslint 和 prettier 插件可以直接添加在 `extensions.json`，方便其他开发人员安装。

```json
{
  // 每一项都是一个插件 ID
  "recommendations": [
    "dbaeumer.vscode-eslint", // eslint 插件ID，下面会讲到此插件
    "esbenp.prettier-vscode", // prettier 插件ID，下面会讲到此插件
    "EditorConfig.EditorConfig", // EditorConfig 插件ID，下面会讲到此插件
    "octref.vetur",
    "formulahendry.auto-close-tag",
    "formulahendry.auto-rename-tag"
  ]
}
```

配置完成后，项目开发者在第一次打开项目的时候会收到 VS Code 的推荐提醒，可以进行一键安装。如果错过了这次提醒，在侧边栏的插件选项中，也可以筛选出推荐插件进行一键安装。

### 关于 任务相关 `tasks.json` 和 调试相关的 `launch.json`，后续有机会再聊。

## EditorConfig

[EditorConfig](https://editorconfig.org/) 是用来帮助开发者定义和维护编码风格的（例如缩进样式，行尾字符等），EditorConfig 包含一个用于定义代码格式的自定义文件 `.editorconfig` 和一批编辑器插件，这些插件是让编辑器能够使用自定义配置文件并以此来格式化代码。

使用了 EditorConfig 后，编辑器的行为会与 `.editorconfig` 文件中定义的一致，并且其优先级比编辑器自身的设置要高（比上一小节讲到的 VS Code 自身配置优先级高）。有些编辑器默认支持 EditorConfig，如 WebStorm；而有些编辑器则需要安装 EditorConfig 插件，如 Sublime、VS Code 等（所以说可以跨编辑器生效）。

VS Code 安装非常简单，直接在插件市场搜索 [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) 安装然后重启编辑器。

当打开一个文件时，EditorConfig 插件会在打开文件的目录和其每一级父目录查找 `.editorconfig` 文件，直到有一个配置文件出现 `root=true`。

EditorConfig 的配置文件是从上往下读取的，并且最近的 `.editorconfig` 会被最先读取，匹配 `.editorconfig` 中的配置项会按照读取顺序被应用，如果 `.editorconfig` 文件没有进行某些配置，则使用编辑器默认的设置。

### 配置 `.editorconfig`

文件名匹配：

```
*                匹配除/之外的任意字符串
**               匹配任意字符串
?                匹配任意单个字符
[name]           匹配name字符
[!name]          不匹配name字符
{s1,s2,s3}       匹配给定的字符串中的任意一个(用逗号分隔)
{num1..num2}   　匹配num1到num2之间的任意一个整数, 这里的num1和num2可以为正整数也可以为负整数
```

常用属性：

```
root :        　　　表示是最顶层的配置文件，发现设为true时，才会停止查找上级的.editorconfig文件
indent_style :    设置缩进风格(tab是硬缩进，space为软缩进)
indent_size :     用一个整数定义的列数来设置缩进的宽度，如果indent_style为tab，则此属性默认为tab_width
tab_width :       用一个整数来设置tab缩进的列数。如果indent_style为space，默认是indent_size
end_of_line :     设置换行符，值为lf、cr和crlf
charset :         设置编码，值为latin1、utf-8、utf-8-bom、utf-16be和utf-16le，不建议使用utf-8-bom
trim_trailing_whitespace :  设为true表示会去除行尾空格
insert_final_newline :      设为true表示使文件以一个空白行结尾
max_line_length ：          最大行宽（vscode 不支持）
curly_bracket_next_line ：     设为false表示大括号不另起一行（vscode 不支持）
spaces_around_operators ：     设为true运算符两边都有空格（vscode 不支持）
quote_type :                设置字符串的引号类型，single是单引号,double是双引号（vscode 不支持）
```

### 使用的基础库和内置对象实例

安装完 EditorConfig 插件，并且创建并完善了 `.editorconfig` 自定义规则，此时，`.editorconfig` 中的规则会覆盖 VS Code user/workspace settings 中对应的配置。

例如一个示例 `.editorconfig` ：

```
root = true

[*]
charset = utf-8

[*.{js,jsx,ts,tsx,vue}]
indent_style = space
indent_size = 2
trim_trailing_whitespace = true
insert_final_newline = true


```

EditorConfig 仅能够简单的配置一些规则，并不能完全满足需求，只是起到一个**跨编辑器和 IDE 统一编码风格的兜底配置**，如果要达到很好的代码规范和编码风格的统一，还需要配置其他代码检查和格式化工具使用，比如：ESLint 和 Prettier。

## ESLint

ESLint 是一款插件化的 JavaScript 代码静态检查工具，其核心是通过 Espree（默认解析器）对 JavaScript 代码解析得到的 AST（抽象语法树）进行模式匹配（每条规则都会对匹配的过程进行监听，每当匹配到一个类型，相应的规则就会进行检查），分析代码达到检查代码质量和编码风格的能力，同时有些 lint 规则可以避免 bug 的产生，在提高代码可读性、可维护性的前提下，减少问题数量。

> 代码检查是一种静态的分析，常用于寻找有问题的模式或者代码，并且不依赖于具体的编码风格。对大多数编程语言来说都会有代码检查，一般来说编译程序会内置检查工具。

ESLint 能够获得成功的几个原因：

- 可以用其他的 parser 来代替默认的 parser，只要它的输出与 Esprima(或 Espree)兼容；
- 可扩展性是关键
- 规则设置为完全可配置，意味着可以关闭每一个规则而只运行基础语法验证，或把 ESLint 默认绑定的规则和你的自定义规则混合

### ESLint 命令行

初始化 ESLint

```
npm install eslint -D

npx eslint --init
```

在 eslint 初始化的时候会询问如何配置，具体问题及选项可以参考：https://github.com/eslint/eslint/blob/v6.0.1/lib/init/config-initializer.js#L422 。

eslint 初始化后会在文件夹的根目录生成一个 `.eslintrc.js` 文件。

运行 `npx eslint .` 可以校验文件夹下的所有文件。

运行 `npx eslint . --fix` 可以修复文件中的问题

### VS Code 使用 ESLint 插件

使用 ESLint 命令行的方式是主动进行的编译动作，这个动作注定不是高频的，但是谁也不想写了几百行代码后，运行 ESLint 校验发现有 n 个警告和报错，所以在编码的过程中实时看到校验结果是很有必要的。

在 VS Code 中可以安装 ESLint 插件，就可以让编辑器实时的提示警告和报错，不必再等到编译时提示了。

当然也可以为 ESLint 启用“保存时自动修复”：

```json
"editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
```

> VS Code 插件运行需要本地项目的 ESLint 相关插件和配置都存在（依赖、配置文件），但不一定要被编译。

既然在 VS Code 中用上了 ESLint 插件能实时提示警告和报错了，那么是不是就用不到命令行的 ESLint 了?

答案是还需要命令行的 ESLint，因为不能保证项目的所有开发者都用了 VS Code，或者也有可能把 ESLint 插件手动关掉了，不管怎样，提交到仓库中的代码必须符合统一的代码规范和编码风格，所以在提交到仓库之前必须要进行一次 ESLint 校验。

### ESLint 配置项解析

ESLint 的配置文件命名可以是 `eslintrc.js`、`eslintrc.yaml`、`eslintrc.json`，甚至配置在 `package.json` 中的 `eslintConfig` 属性。不过 `.eslintrc` 这个配置文件命名据说要被废弃。

从[源码](https://github.com/eslint/eslint/blob/v6.0.1/lib/cli-engine/config-array-factory.js#L52)中可以看出配置文件的优先级如下：

```
const configFilenames = [
     .eslintrc.js ,
     .eslintrc.cjs ,
     .eslintrc.yaml ,
     .eslintrc.yml ,
     .eslintrc.json ,
     .eslintrc ,
     package.json
];
```

以下是较为全面的配置项解析：

- [ESLint 配置项解析](https://juejin.cn/post/6909788084666105864#heading-8)
- [ESLint 之解析包名](https://juejin.cn/post/6923141007663955982)
- [ESLint 配置文件.eslintrc 参数说明](https://gist.github.com/qiqihaobenben/3309a1bad929541fa201397625ea6890)

#### 解析器（parse）

简单说一下三种解析器：

- `espree` ： ESLint 默认解析器
- [@babel/eslint-parser](https://github.com/babel/babel-eslint) ： 可以检查所有有效的 babel 代码，即让 ES6+ 的代码和那些实验性质的语法也能用 ESLint
- [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/parser) ：该解析器将 `TypeScript` 转换成与 `espree` 兼容的格式，从而允许 ESLint 验证 `TypeScript` 源代码。

> 额外说一下，ESLint 默认解析器到底是 Esprima 还是 Espree？ ESLint 最早的版本默认解析器是使用的开源的 Esprima，不过当 ESLint 打算支持 ES6 和 JSX 时发现 Esprima 维护频率不高并且还没有打算发布对 ES6 的支持，经过多方调研，最后选择实现自己的解析器就是 Espree，现在的 ESLint 默认解析器是 Espree。

#### 扩展（extends）

**扩展可以共享配置，并且可以修改规则，然后覆盖掉某些不需要的配置。**

简单说一下几种常见的扩展：

- [eslint-config-airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) ：提供了所有的 Airbnb 的 ESLint 配置。该配置包含了 React 相关的 ESLint 规则，所以需要安装 `eslint-plugin-import`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y` 这四个插件，并且它不支持 React Hooks rules，如果要支持还需要启用 `eslint-config-airbnb/hooks` 这个扩展。

- [eslint-config-airbnb-base](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) ： 不包含 React 的规则，一般用于服务端检查

- [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) ：禁用掉所有那些非必须或者和 prettier 冲突的 ESLint 规则，这样可以避免其他共享配置影响到 Prettier 的格式化。注意该扩展只是将涉及到的规则关掉了（off），所以它只有在和别的配置一起使用的时候才有意义。例如 `extends: ["eslint:recommended", "prettier"]`，prettier 写在最后，后面的规则会覆盖前面的。

#### 插件（plugins）

简单说一下几种常见的插件：

- [@babel/eslint-plugin](https://github.com/babel/babel/tree/main/eslint/babel-eslint-plugin) ： `@babel/eslint-parser` 解析器搭档的插件，为了支持 ES6+ 的代码，`@babel/eslint-plugin` 重新实现了有问题的规则，避免错误误报。
- [eslint-plugin-import](https://github.com/import-js/eslint-plugin-import) ：这个插件的目的是支持检查 ES6+ 的 `import/export` 语法，也能避免文件路径和导入名称的拼写错误
- [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) ： 检查 JSX 元素的可访问性
- [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) ：
  React 专用的校验规则插件
- [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin) ： 提供 TypeScript 代码的检查规则
- [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier) ：让 ESLint 和 Prettier 有良好的配合，这个插件的主要作用是将 `prettier` 作为 ESLint 的规则来使用，相当于代码不符合 Prettier 的标准时，会报一个 ESLint 错误，同时也可以通过 `eslint --fix` 来进行格式化。相当于把 Prettier 整合进了 ESLint 中。

#### 规则（rules）

重点说一下 ESLint 的 rules。官方推荐的规则可以使用 `"extends": ["eslint:recommended"]` 来开启推荐规则，[点击查看详细文档](https://eslint.bootcss.com/docs/rules/)。

ESLint 的规则提示等级：

- `off` 或 0：关闭规则
- `warn` 或 1：开启规则，warn 级别的错误只是警告，不会导致程序退出
- `error` 或 2：开启规则，error 级别的错误当被触发时，程序会推出

ESlint 的规则本身又可以分为两类：

1. 规则没有属性，只需控制是开启还是关闭，例如：`"eqeqeq": "off"` 关闭全等校验
2. 规则有自己的属性，例如：`"quotes": ["error", "double"]`

**还有一点很重要，我们可以通过 `rules` 这个配置项配置任何想要的规则，它会覆盖 `extends` 和 `plugins` 中引入的配置项，也就是说 `.eslintrc.*` 中 `rules` 配置的规则优先级很高。**

有时候我们需要使用自定义规则，自定义 ESLint 规则的实现主要在于理解一个 rule 的结构：

例如：no-with

```js
module.exports = {
  // 包含规则的元数据,包括规则的类型，文档，是否推荐规则，是否可修复等信息
  meta: {
    // 指示规则的类型，值为 "problem"、"suggestion" 或 "layout"
    type: 'suggestion',
    docs: {
      // 对 ESLint 核心规则来说是必需的
      description: 'disallow `with` statements', // 提供规则的简短描述在规则首页展示
      // category (string) 指定规则在规则首页处于的分类
      recommended: true, // 配置文件中的 "extends": "eslint:recommended"属性是否启用该规则
      url: 'https://eslint.org/docs/rules/no-with', // 指定可以访问完整文档的 url
    },

    // fixable 如果没有 fixable 属性，即使规则实现了 fix 功能，ESLint 也不会进行修复。如果规则不是可修复的，就省略 fixable 属性。
    schema: [], // 指定该选项 这样的 ESLint 可以避免无效的规则配置
    // deprecated (boolean) 表明规则是已被弃用。如果规则尚未被弃用，你可以省略 deprecated 属性。
    messages: {
      unexpectedWith: "Unexpected use of 'with' statement.",
    },
  },

  // create (function) 返回一个对象，其中包含了 ESLint 在遍历 js 代码的抽象语法树 AST (ESTree 定义的 AST) 时，用来访问节点的方法。入参为该节点。
  create(context) {
    // 如果一个 key 是个节点类型或 selector，在 向下 遍历树时，ESLint 调用 visitor 函数
    // 如果一个 key 是个节点类型或 selector，并带有 :exit，在 向上 遍历树时，ESLint 调用 visitor 函数
    // 如果一个 key 是个事件名字，ESLint 为代码路径分析调用 handler 函数
    // selector 类型可以到 estree 查找
    return {
      // 入参为节点node
      WithStatement(node) {
        context.report({ node, messageId: 'unexpectedWith' })
      },
    }
  },
}
```

开发一个自定义规则，可以查看官方文档：https://eslint.org/docs/latest/developer-guide/working-with-rules。

有几个开发插件或介绍 ESLint 原理的文章可以看一下：

- [自定义 ESLint 规则，让代码持续美丽](https://www.zoo.team/article/eslint-rules)
- [浅析 ESLint 原理](https://mp.weixin.qq.com/s/0MGRKzCoPM_jn--ttb7b9Q)

#### 几个不常见的配置

- overrides ：我们在 `.eslintrc.*` 的 rules 中配置的规则一般都是全局生效，通过 overrides 可以针对一些文件覆盖一些规则。
- settings ： 通过 settings 可以像每条 rule 传入一些自定义的配置内容。

#### ESLint 检测配置文件步骤

1. 先查看有没有内联配置，如果是命令行在查看有没有配置参数
2. 在要检测的文件同一目录里寻找 `.eslintrc.*` 和 `package.json`
3. 紧接着在父级目录寻找，一直找到文件系统的根目录
4. 如果在前两步发现有 `root: true` 的配置，停止在付目录中寻找 `.eslintrc.*`
5. 如果以上步骤都没找到，则回退到用户主目录 `~/.eslintrc` 中定义的默认配置

### `.eslintignore` 文件

可以通过在项目根目录创建一个 `.eslintignore` 文件告诉 ESLint 去忽略特定的文件和目录。`.eslintignore` 文件是一个纯文本文件，其中的每一行都是一个 glob 模式表明哪些路径应该忽略检测，类似于`.gitignore`。

例如：

```
# 这是一个注释
node_modules/
dist/*.js
```

> ESLint 忽略文件还可以再命令行中通过参数重新设置： `eslint . --ignore-path .gitignore`，即直接使用 .gitignore 当做 .eslintignore

## Prettier

Prettier 官网介绍是这样说的，Prettier 是一个有主见的代码格式化工具，支持多种语言并且集成到了很多编辑器中，并且已经成为了解决所有代码格式问题的优先方案了。

在格式化代码方面，Prettier 和 ESLint 确实有一些重叠，但是从大局观看两者的侧重点不同：**ESLint 主要工作是检查代码质量并给出提示**，它所能提供的格式化功能很有限（ESLint 也不推荐使用自己的格式化功能），并且只支持 JavaScript/TypeScript；**而 Prettier 在格式化代码方面具有更大优势**，支持 JavaScript、Flow、TypeScript、CSS、SCSS、Less、JSX、Vue、GraphQL、JSON、Markdown 等语言。

### Prettier 命令行

```
npm install prettier -D

# 格式化所有文件
npx prettier --write .
```

### VS Code 使用 Prettier 插件

当我们提交代码时，使用命令行校验代码格式，再回去逐行改动格式，重新提交代码是十分影响效率的行为，另外如果项目过大，改动的文件很多，使用 Prettier 进行格式化的时间可能也会较长。

VS Code 安装了 Prettier 插件，这样在保存文件时就能格式化文件从而实现即时格式化。

安装完 Prettier 插件后，在用户或者工作区设置（即 `settings.json`）中将 VS Code 的默认格式化程序设置为 Prettier。

例如：

```json
{
  // 设置全部语言在保存时自动格式化
  "editor.formatOnSave": true,
  // 设置全部语言的默认格式化程序为 prettier
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  // 设置特定语言 JavaScript 的默认格式化程序为 prettier，并设置在保存时自动格式化
  "[javascript]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  // prettier 插件配置的公共规则
  "prettier.semi": true,
  "prettier.arrowParens": "avoid",
  "prettier.singleQuote": false,
  "prettier.tabWidth": 2,
  // vue 文件使用 vetur 作为默认格式化工具
  "[vue]": {
    "editor.defaultFormatter": "octref.vetur",
    "editor.formatOnSave": true
  },
  // vetur 把格式化 JavaScript 文件交给 prettier 处理
  "vetur.format.defaultFormatter.js": "prettier",
  "vetur.format.defaultFormatterOptions": {
    // vetur 使用的 prettier 的规则，此处的规则比上面设置的公共规则优先级高
    "prettier": {
      "semi": false,
      "singleQuote": true
    }
  }
}
```

> 关于特定语言默认有：`javascript`、`javascriptreact`、`typescript`、`typescriptreact`、`json`、`graphql`。其他的语言可以在 `settings.json` 中使用 `files.associations` 关联文件格式。

还是跟 ESLint 一样的问题，既然在 VS Code 中用上了 Prettier 插件能即时进行格式化了，那么是不是就用不到命令行的 Prettier？

答案是还需要命令行的 Prettier ，因为不能保证项目的所有开发者都用了 VS Code，或者也有可能把 Prettier 插件手动关掉了，不管怎样，提交到仓库中的代码必须符合统一的代码规范和编码风格，所以在提交到仓库之前必须要进行一次 Prettier 格式化。

### Prettier 配置

#### 配置文件

Prettier 配置文件支持多种形式：

- 根目录创建 `.prettierrc` 文件，能够写入 `YML`、`JSON` 的配置格式，并且支持 `.yaml`、`.yml`、`.json`、`.js`；
- 根目录创建 `prettier.config.js` 文件，并对外 `export` 一个对象
- 在 `package.json` 中新建 `Prettier` 属性

#### 属性

例如创建 `prettierrc.js`：

```js
module.exports = {
  printWidth: 80, //换行的宽度，如果超过会进行换行，默认为80
  tabWidth: 2, //tab的空格宽度，默认为80
  useTabs: false, //缩进用tab还是空格，默认为false，表示用空格进行缩减
  singleQuote: false, //字符串是否使用单引号，JSX会忽略这个配置，默认为false，使用双引号
  semi: true, //行尾是否使用分号，默认为true
  trailingComma: 'none', //是否使用尾逗号，有三个可选值"<none|es5|all>"
  bracketSpacing: true, //对象大括号直接是否有空格，默认为true，效果：{ foo: bar }
  arrowParens: 'avoid', //箭头函数的单参数是否用括号包裹，有两个可选值"<always|avoid>"
  parser: 'babylon', //代码的解析引擎，默认为babylon，与babel相同。
}
```

### `.prettierignore` 文件

使用 `.prettierignore` 文件完全忽略（即不重新格式化）某些文件和文件夹，跟 `.eslintignore` 文件一样。

### Prettier 与 ESLint 配合

ESLint 和 Prettier 搭配使用时，他们有交集的那部分规则可能会导致 ESLint 和 Prettier 格式化后的代码格式不一致（比如单双引号/是否使用分号等）。例如 Prettier 格式化代码后再用 ESLint 去检测，会出现一些因为格式化导致的警告或报错，ESLint 进行修复后，又不符合 Prettier 的格式，然后保存的时候又会被格式化，然后陷入“死循环”。

> 这种问题的主要解决思路是在 ESLint 的规则配置文件上做文章，安装特定的扩展，把其配置到规则的尾部，实现 Prettier 规则对 ESLint 规则的覆盖。

这就需要之前说的 [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) 扩展，它的作用就是禁用掉所有那些非必须或者和 prettier 冲突的 ESLint 规则。

```
npm install eslint-config-prettier -D

// 在 .eslintrc.* 文件中的 extends 字段的最后添加 prettier
{
  "extends": [
    "eslint:recommended", // 已经配置的扩展
    "prettier" // prettier 扩展添加到其他扩展的后面，可以实现 Prettier 规则对 ESLint 规则的覆盖
  ]
}
```

以上只是把 ESLint 和 Prettier 会产生的一些冲突解决掉了，实现了运行 ESLint 命令会按照 Prettier 的规则做相关校验。但是如果要实现代码格式化，还得需要手动运行 Prettier 的相关命令来进行格式化，社区的解决方案是在使用 `eslint --fix` 的时候，实际使用 Prettier 来替代 ESLint 的格式化功能。

这时候就需要用到之前讲过的 [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier)

```
npm install eslint-plugin-prettier -D

// 在 .eslintrc.* 中的配置如下
{
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}

```

此时再执行 `eslint --fix` 实际使用的是 Prettier 的规则去格式化代码。在 `rules` 中添加 `"prettier/prettier": "error"`，当代码出现 Prettier 的规则校验出的格式化问题，ESLint 会报错。

如果想同时解决规则冲突和自动格式化，可以通过如下方式简化：

```json
// 在 .eslintrc.* 中的配置如下
{
  "extends": ["plugin:prettier/recommended"]
}
```

上面的配置等价与下面的配置：

```json
{
  "extends": ["prettier"], // eslint-config-prettier 提供的，用于覆盖起冲突的规则
  "plugins": ["prettier"], // 注册 eslint-plugin-prettier 插件
  "rules": {
    "prettier/prettier": "error",
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off"
  }
}
```

## Husky + lint-staged

在整个前端代码规范和编程风格的流程最后两个工具，简单介绍一下。

为了保证仓库中的代码是符合代码规范和编程风格的，最好的方法是确保本地的代码已经通过检查才能 push 到远程，即在本地进行 `git commit` 操作前触发对代码的检查，所以就需要 githook 工具 `husky`。

```
# husky 的初始化，创建 .husky/ 目录并制定该目录为 git hooks 所在的目录，并且在 .husky/ 目录下会新增 pre-commit 的 shell 脚本，并且加入了 npm test 命令

npx husky-init && npm install

# 在进行 git commit 之前运行 npx eslint src/** 检查

npx husky add .husky/pre-commit "npx eslint src/**"
```

不过每次提交都检查所有的文件效率非常低，最好是每次只对当前修改后的文件进行扫描，即只对 `git add` 加入到 `stage` 缓存区的文件进行扫描，从而实现只对增量代码进行检查。这里就需要使用 `lint-staged` 工具来识别被加入到 `stage` 缓存区的文件。

```json
// package.json
{
  "lint-staged": {
    "*.{js}": ["npx eslint --fix"]
  }
}
```

对当前改动的 .js 文件在提交时进行检测和自动修复，自动修复完成后 lint-staged 默认会把改动的文件再次 add 到暂存区，如果有无法修复的错误会报错提示。

搭配 husky 使用时，修改 `.husky/pre-commit`，在 commit 之前运行 `npx lint-staged` 来校验提交到暂存区中的文件：

```sh
#!/bin/sh

. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```

### husky + lint-staged + eslint 更简单的集成方式

使用 [mrm](https://mrm.js.org/)

```
# mrm最新版本使用 npx 执行有问题，所以使用 2.x 版本
npx mrm@2 lint-staged
```

它其实相当于一个任务，做了三件事：

- 在 `package.json` 中增加了 lint-staged 的配置
- 设置 `pre-commit` git hook
- 安装依赖

## 推荐阅读

- [Visual Studio Code 使用笔记](https://learnku.com/articles/48341)
- [你不知道的 Vscode 之项目约束 | 仓库配置](https://developer.51cto.com/article/704810.html)
- [统一代码风格工具——EditorConfig](https://cloud.tencent.com/developer/article/1546185)
- [回顾 ESLint 的成功](https://github.com/xitu/gold-miner/blob/master/TODO/reflections-on-eslints-success.md)
- [ESLint 配置项解析](https://juejin.cn/post/6909788084666105864#heading-8)
- [ESLint 之解析包名](https://juejin.cn/post/6923141007663955982)
- [ESLint 工作原理探讨](https://zhuanlan.zhihu.com/p/53680918)
- [Eslint 的实现原理，其实挺简单](https://zhuanlan.zhihu.com/p/427903272)
- [ESLint 工作原理探讨](https://zhuanlan.zhihu.com/p/53680918)
- [零基础理解 ESLint 核心原理](https://mp.weixin.qq.com/s/wzFh_dvB13hq9OV3pC955w)
- [浅析 eslint 原理](https://mp.weixin.qq.com/s/45-itfERV4R77WS0JL_Oew)
- [自己动手写符合自己业务需求的 eslint 规则](https://mp.weixin.qq.com/s/cbWY0BYeNiCuNtpmylOH9g)
- [为什么 Eslint 可以检查和修复格式问题，而 Babel 不可以？](https://mp.weixin.qq.com/s/eZuJFDTh3UBmkXkubIT1_g)
- [深入对比 eslint 插件 和 babel 插件的异同点](https://zhuanlan.zhihu.com/p/406084980)
- [从 ESLint 开启项目格式化](https://mp.weixin.qq.com/s/gKekFhECTiMGt5L7Qfd59Q)
- [前端代码规范工程化最佳实践 - ESLint](https://mp.weixin.qq.com/s/2XmU8A9l3EoTwPLRkuCetA)
- [Prettier 看这一篇就行了](https://zhuanlan.zhihu.com/p/81764012)
