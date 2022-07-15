# VS Code 编辑器团队代码风格统一

## VS Code 编辑器自身配置

VS Code 的配置有三种形式：全局默认配置、用户配置、工作区配置。

- 全局默认配置：VS Code 在安装的时候在安装目录会有一个 `settings.json` 配置文件。
- 用户配置：对应的是软件目录中跟当前用户相关联的特定文件夹中的 `settings.json` 配置文件（类似于 macOS 中 $HOME/Library/Application Support/Code/User/settings.json），用户配置在所有打开窗口都生效。通过 `ctrl/cmd + ,` 打开的设置就是用户配置 `settings.json` UI 视图。
- 工作区配置：也称项目配置，此时的 `settings.json` 存放于项目所在位置的 `.vscode` 文件中，当项目在 VS Code 中打开时，仅针对当前项目打开的窗口生效。

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

编辑器的行为会与 `.editorconfig` 文件中定义的一致，并且其优先级比编辑器自身的设置要高（比上一小节讲到的VS Code自身配置优先级高）。有些编辑器默认支持 EditorConfig，如WebStorm；而有些编辑器则需要安装 EditorConfig 插件，如Sublime、VS Code等（所以说可以跨编辑器生效）。

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
tab_width :       用一个整数来设置tab缩进的列数。默认是indent_size
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


EditorConfig 仅能够简单的配置一些规则，并不能完全满足需求，只是起到一个**跨编辑器和IDE统一编码风格的兜底配置**，还需要配置其他代码检查和格式化工具使用，比如：ESLint 和 Prettier。

## ESLint

ESLint 是一款插件化的 JavaScript 代码静态检查工具其核心是通过对代码解析得到的 AST（抽象语法树）进行模式匹配，来分析代码打到检查代码质量和编码风格的能力。

> 代码检查时一种静态的分析，常用于寻找有问题的模式或者代码，并且不依赖于具体的编码风格。对大多数编程语言来说都会有代码检查，一般来说编译程序会内置检查工具。

ESLint 流程的几个原因：

- 可以用其他的 parser 来代替默认的 parser，只要它的输出与 Esprima(或 Espree)兼容；
- 可扩展性是关键
- 规则设置为完全可配置，意味着可以关闭每一个规则而只运行基础语法验证，或把ESLint 默认绑定的规则和你的自定义规则混合

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

既然在 VS Code 中用上了ESLint 插件能实时提示警告和报错了，那么是不是就用不到命令行的 ESLint了。

答案是肯定还需要命令行的 ESLint，因为不能保证项目的所有开发者都用了 VS Code，或者也有可能把 ESLint 插件手动关掉了，不管怎样，提交到仓库中的代码必须符合统一的代码规范和编码风格，所以在提交到仓库之前必须要进行一次 ESLint 校验。

### ESLint 配置项解析

ESLint 的配置文件命名可以是 `eslintrc.json`、`eslintrc.js`、`eslintrc.yaml`，甚至配置在 `package.json` 中。

- [ESLint 配置项解析](https://juejin.cn/post/6909788084666105864#heading-8)
- [ESLint 之解析包名](https://juejin.cn/post/6923141007663955982)


## Prettier

Prettier 官网介绍是这样说的，Prettier 是一个有主见的代码格式化工具，支持多种语言并且集成到了很多编辑器中，并且已经成为了解决所有代码格式问题的优先方案了。

在格式化代码方面，Prettier 和 ESLint 确实有一些重叠，但是从大局观看两者的侧重点不同：ESLint 主要工作是检查代码质量并给出提示，它所能提供的格式化功能很有限，并且只支持 JavaScript/TypeScript；而 Prettier 在格式化代码方面具有更大优势，支持 JavaScript、Flow、TypeScript、CSS、SCSS、Less、JSX、Vue、GraphQL、JSON、Markdown等语言。

### Prettier 命令行

```
npm install prettier -D

# 格式化所有文件
npx prettier --write .
```

### VS Code 使用 Prettier 插件

当我们提交代码时，使用命令行校验文件格式，再回去逐行改动格式，重新提交代码是十分影响效率的行为，另外如果项目过大，改动的文件很多，使用 Prettier 进行格式化的时间可能也会较长。

VS Code 安装了 Prettier 插件，这样在保存文件时就能格式化文件从而实现即时格式化。

安装完 Prettier 插件后，在用户或者工作区设置（即 `settings.json`）中将VS Code 的默认格式化程序设置为 Prettier。

```json
// 设置全部语言在保存时自动格式化
"editor.formatOnSave": true,
// 设置全部语言的默认格式化程序为 prettier
"editor.defaultFormatter": "esbenp.prettier-vscode",
// 设置特定语言 JavaScript 的默认格式化程序为 prettier，并设置在保存时自动格式化
"[javascript]": {
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
},
```

> 关于特定语言默认有：`javascript`、`javascriptreact`、`typescript`、`typescriptreact`、`json`、`graphql`。其他的语言可以在 `settings.json` 中使用 `files.associations` 关联文件格式。

### Prettier 配置

#### 配置文件

Prettier 有配置文件和 `ignore` 文件两种。

配置文件支持多种形式：
- 根目录创建 `.prettierrc` 文件，能够写入 `YML`、`JSON` 的配置格式，并且支持 `.yaml`、`.yml`、`.json`、`.js`；
- 根目录创建 `prettier.config.js` 文件，并对外 `export` 一个对象
- 在 `package.json` 中新建 `Prettier` 属性

#### Prettier 与 ESLint 配合

ESLint 和 Prettier 搭配使用时，他们有交集的那部分规则，ESLint 和 Prettier 格式化后的代码格式不一致。这就导致了 Prettier 格式化代码后再用 ESLint 去检测，会出现一些因为格式化导致的警告或报错，ESLint 进行修复后，又不符合 Prettier 的格式，然后保存的时候又会被格式化，然后陷入“死循环”。

> 这种问题的主要解决思路是在 ESLint 的规则配置文件上做文章，安装特定的 plugin，把其配置到规则的尾部，实现 Prettier 规则对 ESLint 规则的覆盖。



## 推荐阅读

- [Visual Studio Code 使用笔记](https://learnku.com/articles/48341)
- [你不知道的Vscode之项目约束 | 仓库配置](https://developer.51cto.com/article/704810.html)
- [统一代码风格工具——EditorConfig](https://cloud.tencent.com/developer/article/1546185)
- [回顾 ESLint 的成功](https://github.com/xitu/gold-miner/blob/master/TODO/reflections-on-eslints-success.md)
- [ESLint 配置项解析](https://juejin.cn/post/6909788084666105864#heading-8)
- [ESLint 之解析包名](https://juejin.cn/post/6923141007663955982)
