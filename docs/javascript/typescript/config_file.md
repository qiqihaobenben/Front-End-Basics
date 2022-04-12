# tsconfig.json 配置文件

tsconfig.json 是 TypeScript 项目的配置文件。如果一个目录下存在一个 tsconfig.json，则说明该目录是 TypeScript 项目的根目录。

通常 tsconfig.json 文件主要包含两部分内容：**指定待编译文件**和**配置编译选项**。

在简单的练手时，我们可以使用 `tsc` 命令编译少量的 TypeScript 文件，例如

```
tsc --outFile demo.js --target es3 --module amd index.ts
```

但是如果实际开发的项目，就需要使用 tsconfig.json，把用到的配置都写进 tsconfig.json，这样就不用每次编译都手动输入配置，也方便团队协作开发。

## 初始化 tsconfig.json

1. 手动在项目根目录（或其他目录）创建 tsconfig.json 文件并填写配置；
2. 通过 `tsc --init` 初始化 tsconfig.json 文件。

## 指定需要编译的目录

在不指定输入文件的情况下执行 `tsc` 命令，默认从当前目录开始编译，编译所有 `.ts` 文件，并且从当前目录开始逐级向上级目录搜索查找 tsconfig.json 文件。

另外，`tsc` 命令可以通过参数 `--project` 或 `-p` 指定需要编译的目录，该目录需要包含一个 tsconfig.json 文件（或者包含有效配置的 `.json` 文件）。

```
/*
  文件目录：
  ├─src/
  │  ├─index.ts
  │  └─tsconfig.json
  ├─package.json
*/
$ tsc --project src
```

**注意：tsconfig.json 文件可以是个空文件，那么所有默认的文件都会以默认配置选项编译。**

## tsconfig.json 配置介绍

### compileOnSave

`compileOnSave` ：类型 `Boolean`，该属性是 tsconfig.json 的顶级属性，设置保存文件的时候自动编译，需要编辑器支持。

### compilerOptions

`compilerOptions` ：类型 `Object`，配置编译选项

若 `compilerOptions` 属性被忽略，则编译器会使用默认值。可以查看 [编译选项文档](https://www.typescriptlang.org/docs/handbook/compiler-options.html)

#### 项目选项

这些选项用于配置项目的运行时期望、编译后的 JavaScript 的输出方式和位置，以及与现有 JavaScript 代码的集成级别。

- target：类型 `String`，指定编译代码的目标，不同的目标将影响代码中使用的特性是否会被降级，可用的值有 ► "ES3"（默认值） ► "ES5" ► "ES6"/ "ES2015" ► "ES2016" ► "ES2017" ► "ES2018" ► "ES2019" ► "ES2020" ► "ESNext"
- module：类型 `String`，指定生成哪个模块系统代码，可以为 `"None"`、`"CommonJS"`、`"AMD"`、`"System"`、`"UMD"`、`"ES6"`/`"ES2015"`、`ES2020`、`ES2022`、`ESNext`、`Node12` 或者 `Nodenext`。默认值为 `target === "ES3" or "ES5" ? "CommonJS" : "ES6/ES2015"`
- jsx：类型 `"react"|preserve|"react-native"|"react-jsx"|"react-jsxdev"`，在 .tsx 文件里支持 JSX，没有默认值
- jsxFactory：类型 `String`，指定 `"jsx": "react"`时，使用的 JSX 工厂函数，比如 `React.createElement` 或 `h`，配合 `jsx` 属性一起用。默认值为 `React.createElement`
- incremental：类型 `Boolean`，TS 编译器在第一次编译之后会生成一个储存编译信息的文件，第二次编译会在第一次的基础上进行增量编译，可以提高编译的速度。默认值分为两种情况，当 `composite` 为 `true` 时，默认值为 `true`，否则为 `false`
- tsBuildInfoFile：类型 `String`，增量编译文件的存储位置，配合 `--incremental` 一起使用
- declaration：类型 `Boolean`，构建 ts 文件时是否生成相应的 `.d.ts` 声明文件，开启后会自动生成声明文件，这些 `.d.ts`文件描述了模块导出的 API 类型，具体行为可以在 [playground](https://www.typescriptlang.org/play?#code/C4TwDgpgBAtghmAKuCAGAPIgfFAvFAbwCgooBtAaygEsA7KCiEAewDMpEBdALg8s6IBfIkQDGzWgGdgUZnkIlSUOLwCMAGkWkARrwDkAJj1CxEycwA2EAHQXmAcwAUoSG1kBKIi+jwwq+b7IkBjebsxYlExuoezMAqRAA) 中编写代码，并在右侧的 .D.TS 观察输出。默认值分为两种情况，当 `composite` 为 `true` 时，默认值为 `true`，否则为 `false`
- declarationDir：类型 `String`，指定生成的声明文件存放目录，默认输出路径为生成的目标文件相同位置
- declarationMap：类型 `Boolean`，为声明文件生成 sourceMap，默认值为 `false`
- emitDeclarationOnly：类型 `Boolean`，只生成声明文件，而不会生成 js 文件，默认值为 `false`
- sourceMap：类型 `Boolean`，生成目标文件的 [sourceMap 文件](https://developer.mozilla.org/en-US/docs/Tools/Debugger/How_to/Use_a_source_map)（.map 文件），这些文件允许调试器和其他工具在使用实际生成的 JavaScript 文件时，显示原始的 TypeScript 代码，默认值 `false`
- lib：TS 需要引用的库，即声明文件包，es5 默认引用 DOM、ES5、ScriptHost，es6 默认引用 DOM、ES6、DOM.Iterable、ScriptHost。 如果需要使用 es 的高级版本特性，通常都需要配置，可能的值有： ► ES5 ► ES6 ► ES2015 ► ES7 ► ES2016 ► ES2017 ► ES2018 ► ESNext ► DOM ► DOM.Iterable ► WebWorker ► ScriptHost ► ES2015.Core ► ES2015.Collection ► ES2015.Generator ► ES2015.Iterable ► ES2015.Promise ► ES2015.Proxy ► ES2015.Reflect ► ES2015.Symbol ► ES2015.Symbol.WellKnown ► ES2016.Array.Include ► ES2017.object ► ES2017.Intl ► ES2017.SharedMemory ► ES2017.String ► ES2017.TypedArrays ► ES2018.Intl ► ES2018.Promise ► ES2018.RegExp ► ESNext.AsyncIterable ► ESNext.Array ► ESNext.Intl ► ESNext.Symbol，具体详情可在 [TypeScript 源码](https://github.com/microsoft/TypeScript/tree/master/lib)中查看完成列表。
- project：类型 `String`，编译指定目录下的项目，这个目录应该包含一个 tsconfig.json 文件
- composite：类型 `Boolean`，确保 TypeScript 可以确定在哪里可以找到引用项目的输出以编译项目。默认为 `true`。 [查看具体示例](https://juejin.cn/post/6844904004615421966)
- outDir：类型 `String`，指定输出目录，默认值为目标文件当前位置
- outFile：类型 `String`，将多个相互依赖的文件生成一个文件，可以用在 AMD 模块中，即开启时应设置 `"module": "AMD"`
- allowJs：类型 `Boolean` ，允许编译器编译 JS 或 JSX 文件，默认值 `false`
- checkJs：类型 `Boolean`，允许在 JS 文件中报错，通常与 allowJS 一起使用，默认值为 `false`

#### 严格模式

TypeScript 兼容 JavaScript 代码，默认选项允许相当大的灵活性来适应这些模式。在迁移 JavaScript 代码时，可以先暂时关闭一些严格模式的设置。在正式的 TypeScript 项目中，推荐开启 strict 设置启用更严格的类型检查，以减少错误的发生。

- strict：类型 `Boolean`，开启所有严格的类型检查选项，启用 `--strict` 相当于启用 `--noImplicitAny`、`--noImplicitThis`、`--alwaysStrict`、`--strictBindCallApply`、`--strictNullChecks`、`--strictFunctionTypes`、`--strictPropertyInitialization`，默认值为 false
- alwaysStrict：类型 `Boolean`，保证编译出的文件是 ECMAScript 的严格模式并为每个源文件插入 `"use strict";` 语句，默认值为 `false`
- noImplicitAny：类型 `Boolean`不允许隐式的 any 类型，默认值为 `false`
- strictNullChecks：类型 `Boolean`，更严格地检查 null 和 undefined 类型，不允许把 null、undefined 赋值给其他类型的变量，例如，数组的 find 方法的返回类型将是更严格的 `T | undefined`
- strictFunctionTypes：类型 `Boolean`，开启时，不允许函数参数双向协变（参数的变型规则是，true 是逆变，false 是双向协变）
- strictPropertyInitialization：类型 `Boolean`，类的实例属性必须初始化，`--strictNullChecks` 必须启用此选项才能生效
- strictBindCallApply：类型 `Boolean`，更严格的 bind/call/apply 检查，比如会检查参数的类型与函数类型是否一致。
- noImplicitThis：类型 `Boolean`，不允许 this 有隐式 any 类型

#### 额外检查

TypeScript 支持一些额外的代码检查，在某种程度上介于编译器和静态分析工具之间。

- noUnusedLocals：检查只声明但未使用的局部变量（只提示不报错）
- noUnusedParameters：检查未使用的函数参数（只提示不报错）
- noFallthroughCasesInSwitch：类型 `Boolean`，报告 switch 语句的 fallthrough 错误（即，不允许 switch 的 case 语句贯穿），开启后，如果 switch 语句的流程分支中没有 break 或 return，则会抛出错误，从而避免了意外的 switch 判断穿透导致的问题。默认值为 false
- noImplicitReturns：类型 `Boolean`，当函数的所有返回路径代码都没有返回值时报错，即如果代码的逻辑分支中有返回，则所有的逻辑分支都应该有返回。默认值为 `false`
- allowUmdGlobalAccess：类型 `Boolean`，允许在模块中用全局变量的方式访问 umd 模块，默认值为 `false`
- allowUnreachableCode：类型 `Boolean`，不报告执行不到的代码错误，默认值为 `false`（不建议修改此选项）
- allowUnusedLabels：类型 `Boolean`，不报告未使用的标签错误，默认为 `false`

#### 模块解析

模块解析部分的编译选项会影响代码中模块导入以及编译相关的配置。

- moduleResolution：类型 `String`，模块解析策略，默认值为 `module === "AMD" or "UMD" or "System" or ES6/ES2015 ? "Classic" : "Node"`。在目前的新代码中，我们一般都是使用 Node，而不是用 Classic。具体的模块解析策略可以[查看详情](https://www.typescriptlang.org/docs/handbook/module-resolution.html#module-resolution-strategies)
- baseUrl：类型 `String`，解析非相对模块名的基准目录，默认是当前目录。实践证明，当 ts 中 import 引用非相对路径的模块，例如 `import "foo"`，ts 会首先查询 node_modules 目录，如果没有查找到需要的，就会根据 baseUrl 设置的路径目录查找该模块。可以查看[模块解析文档](https://www.tslang.cn/docs/handbook/module-resolution.html#base-url)了解详情
- paths：类型 `Object`，基于 baseUrl 的路径映射列表，用来将模块路径重新映射到相对于 baseUrl 定位的其他路径配置。这里我们可以将 paths 理解为 webpack 的 alias 别名配置。默认值为 `{}`，查看[模块解析文档](https://www.tslang.cn/docs/handbook/module-resolution.html#path-mapping)了解详情
- rootDir：类型 `String`，仅用来控制 `--outDir` 输出的目录结构，默认值为基于 input 传入的文件列表计算来的公共根路径
- rootDirs：类型 `Array<String>`，根（root）文件夹列表，可以指定多个目录作为根目录，这个选项允许编译器在这些“虚拟”目录中解析相对应的模块导入，就像他们被合并到同一个目录中一样，查看 [模块解析文档](https://www.tslang.cn/docs/handbook/module-resolution.html#virtual-directories-with-rootdirs) 了解详情
- typeRoots：类型 `Array<String>`，声明文件包根目录，默认是 node_modules/@types，如果 typeRoots 指定，则仅包括 typeRoots 下面的包。
- types：类型 `Array<String>`，加载的声明文件包，默认情况下，所有的 typeRoots 包都将被包含在编译过程中。如果指定 types 属性，将仅检索指定名称的 @types 包。当 types 是 `[]` 时，表示禁止自动包含任何 @types 包。可以[查看详情](https://www.tslang.cn/docs/handbook/tsconfig-json.html#types-typeroots-and-types)了解。
- allowSyntheticDefaultImports：类型 `Boolean` ，允许从没有设置默认导出的模块中默认导入，即使一个模块没有默认导出（`export default`），也可以在其他模块中像导入包含默认导出模块一样的方式导入这个模块。这并不影响代码的输出，仅为了类型检查。默认值有两种情况：1、 `module === "system"` 或设置了 `esModuleInterop` 且 `module` 不为 `es2015`/`esnext` 时，默认值为 `true`；2、其他情况下默认值为 `false`。具体含义可以查看[TypeScript 中的多种 import 解义](https://tasaid.com/blog/2019022017450863.html)
- esModuleInterop：类型 `Boolean`，指的是 ES 模块的互操作性。在默认情况下，TypeScript 像 ES6 模块一样对待 CommonJS/AMD/UMD，但是此时的 TypeScript 代码转译会导致不符合 ES6 模块规范，不过，开启 esModuleInterop 后，这些问题都将得到修复。一般情况下，在启用 esModuleInterop 时，会同时启用 allowSyntheticDefaultImports。

#### Source Maps

为了支持丰富的调试工具并未开发人员提供有意义的崩溃报告，TypeScript 支持生成符合 JavaScript Source Map 标准的附加文件（即 .map 文件）

- sourceRoot：类型 `String`，指定 TypeScript 源文件的路径，以便调试器定位。当 TypeScript 文件的位置是在运行时指定时使用此标记，路径信息会被加到 `sourceMap`里。默认值为 `false`
- mapRoot：类型 `String`，为调试器指定 sourcemap 文件的路径，而不是使用生成的文件位置。当 .map 文件是在运行时指定的，并且不同于生成的目标文件地址时使用这个选项，指定的路径会嵌入到 sourceMap 里告诉调试器到哪里去找它们。
- inlineSourceMap：类型 `Boolean`，生成单个 sourcemaps 文件，而不是将 sourcemaps 生成不同的文件。默认值为 `false`
- inlineSources：类型 `Boolean`，生成目标文件的 inlineSource，inlineSource 会包含在生成的 js 文件中，默认为 `false`，设置为 `true` 时要求同时设置 --inlineSourceMap 或 --sourceMap 属性

#### 其他选项

- skipLibChcek：类型 `Boolean`，表示可以跳过检查声明文件，如果开启了这个选项，可以节省编译期的时间，但可能会牺牲类型系统的准确性，不过还是推荐设置为 `true`
- diagnostics：类型 `Boolean`，打印诊断信息，默认值为 `false`
- extendedDiagnostics：类型 `Boolean`，显示详细的诊断信息，默认值为 `false`
- isolatedModules：类型 `Boolean`，将每个文件作为单独的模块（与 "ts.transpileModule" 类似），默认值为 `false`
- forceConsistentCasingFileNames：类型 `Boolean`，禁止对同一文件使用大小写不一致的引用，TypeScript 对文件的大小写是敏感的，如果有一部分的开发人员在大小写敏感的系统开发，而另一部分的开发人员在大小写不敏感的系统开发，就可能出现问题。默认值为 `false`
- removeComments：类型 `Boolean`，删除注释，除了以 `/!*`开头的版权信息，默认值为 `false`
- noEmit：类型 `Boolean`，不输出文件，即编译后不会生成任何 JS 文件，默认为 false
- noEmitOnError：类型 `Boolean`，发生错误时不输出任何文件，默认为 false
- noEmitHelpers：类型 `Boolean`，不在输出文件中生成用户自定义的帮助函数，如 `__extends`，减小体积，需要额外安装，常配合 importHelpers 一起使用
- importHelper：类型 `Boolean`，通过 tslib 引入 helper 函数（比如 extends,rest 等），文件必须是模块。tslib 是 TypeScript 运行时库，其中包含所有 TypeScript 辅助函数，需要安装 tslib 依赖。
- disableSizeLimit：类型 `Boolean`，取消 JavaScript 代码体积大小不能超过 20M 的限制，默认为 `false`
- downlevelIteration：类型 `Boolean`，降级遍历器实现，如果 `target` 是 es3/5，那么遍历器会有降级的实现
- listEmittedFiles：类型 `Boolean`，打印编译后生成的文件名称，默认值为 `false`
- listFiles：类型 `Boolean`，在编译过程中打印文件名称（包括引用的声明文件），默认值为 `false`
- locale：类型 `String` 用于显示错误消息的语言环境，例如 zh-CN，默认值根据环境确定。
- keyofStringOnly：类型 `Boolean`，设置 ts 的 keyof 关键字仅解析字符串值的属性名称（不解析数字或 symbol 属性），默认值为 `false`

### exclude

`exclude`：类型：`Array<string>`，指定编译器需要排除的文件或文件夹列表。可以排除 `include` 包含的文件路径，但是不能排除 file 直接指定的文件。

`exclude` 属性默认不包括 node_modules。

支持 glob 通配符

- `*` 匹配 0 或 多个字符（不包括目录分隔符）
- `?` 匹配一个任意字符（不包括目录分隔符）
- `**/`递归匹配任意子目录

### include

`include`：类型：`Array<string>`，指定编译需要编译的文件或目录列表，跟 `exclude` 属性一样，支持 glob 通配符。

### files

`files`：类型：`Array<string>`，指定需要编译的单个文件列表，是一个 相对路径 或者 绝对路径 的文件列表。默认包含当前目录和子目录下所有 TypeScript 文件。

当入口文件依赖其他文件时，不需要将被依赖文件也制定到 `files` 中，因为编译器会自动将所有的依赖文件归纳为编译对象。

### extends

`extends`：类型 `String` ，引入其他配置文件，继承配置。该选项属性值是一个字符串，表示的是另一个配置文件的访问路径。

`extends` 是 tsconfig.json 文件里的顶级属性（与 compilerOptions、files、include 和 exclude 等一样）。

`extends` 的值是一个字符串，包含指向另一个要继承文件的路径，继承的配置文件的相对路径在解析时是相对于它所在的文件的。在原文件里的配置先被加载，然后被来自继承文件里的配置重写。如果发现循环引用，则会报错。

### references

`references`：指定工程引用依赖

### typeAcquisition

`typeAcquisition`：设置自动引入库类型定义文件（.d.ts）相关

包含 3 个子属性：

- `enable`：布尔类型，是否开启自动引入库类型定义文件（.d.ts），默认为 false
- `include`：数组类型，允许自动引入的库名，如：`["jquery", "lodash"]`
- `exclude`：数组类型，排除的库名

## 注意

### 命令行参数优先级

`tsc` 的命令行上指定的编译选项具有更高的优先级，会覆盖 tsconfig.json 中的相应选项。

### files、include、exclude

如果一个 glob 模式里的某部分只包含 `*` 或 `.*`，那么仅有支持的文件扩展名类型被包含在内（比如默认 `ts`、`tsx` 和 `.d.ts`，如果 `"allowJs": true`，那么，还包含 `.js` 和 `.jsx`）。

如果 `files` 和 `include` 都没有被指定，编译器默认包含当前目录和子目录下所有的 TypeScript 文件（`.ts`、`.tsx` 和 `.d.ts`，如果`"allowJs": true`，那么，还包含 `.js` 和 `.jsx`），但是排除 `exclude` 中指定的文件。

如果指定了 `files` 和 `include`，编译器会将它们包含的文件取并集。不过使用 `outDir` 指定的目录下的文件永远会被编译器排除，除非明确地使用 `files` 将其包含进来（这时就算用 `exclude` 排除也没用）。

使用 `include` 引入的文件可以使用 `exclude` 属性过滤，但是通过 `files` 属性明确指定的文件始终会被包含在内，不管 `exclude` 如何设置。如果没有特殊指定，`exclude` 默认情况下会排除 `node_modules`、`bower_components`、`jspm_packages` 和 `<outDir>` 目录。

编译器不会去引入那些可能作为输出的文件；比如，假设我们包含了 `index.ts`，那么 `index.d.ts` 和 `index.js` 会被排除在外。通常来讲，不推荐只用扩展名的不同来区分同目录下的文件。

### types

只有当你使用了全局环境声明的时候，自动包含才显得重要，如果没有用到全局声明的时候，就可以不需要自动包含，使用 import "module" 的时候，ts 会自动去 node_modules & node_modules/@types 文件夹查找对应声明文件包。

### jsx

jsx 五种类型的区别：

preserve：生成的代码中会保留 JSX 以供其他转换操作（例如 Babel）进一步使用，输出文件的扩展名为 `.jsx`

react：会生成 `React.createElement`（`React` 标识符是写死的硬编码，所以必须保证 React(大写的 R) 是可用的），即将 jsx 改为等价的`React.createElement`的调用，在使用之前不需要再进行转换操作了，输出文件的扩展名为 `.js`

react-native 模式相当于 preserve 它也保留了所有的 JSX，但是输出文件的扩展名是 `.js`

react-jsx：改为 `__jsx` 调用，输出文件的扩展名是 `.js`

react-jsxdev：改为 `__jsxDEV` 调用，输出文件的扩展名是 `.js`

### module

- 只有 `"AMD"` 和 `"System"` 能和 --outFile 一起使用。
- `"ES6"`/`ES2015` 可使用在 `target` 为 `"ES5"` 或更低的情况下

### lib

安装 TypeScript 时会顺带安装一个 `lib.d.ts` 的声明文件，并且默认包含了 ES5、DOM、WebWorker、ScriptHost 的库定义。

lib 配置项允许更细粒度地控制代码运行时的库定义文件，比如说 Node.js 程序，由于并不依赖浏览器环境，因此不需要包含 DOM 类型定义；而如果需要使用一些最新的、高级 ES 特性，则需要包含 ESNext 类型。

### paths

因为 paths 中配置的别名仅在类型检测时生效，所以在使用 tsc 转译或者 webpack 构建 TypeScript 代码时需要引入额外的插件将源码中的别名替换成正确的相对路径。

## VS Code 切换 TypeScript 版本

因为 VS Code 中内置了特定版本 TypeScript 语言服务，所以它天然支持 TypeScript 语法解析和类型检测，且这个内置的服务与手动安装的 TypeScript 完全隔离。因此， VS Code 支持在内置和手动安装版本之间动态切换语言服务，从而实现对不同版本的 TypeScript 的支持。

例如 VS Code 的 TypeScript 的版本是 4.4.3，但是我们需要用到 TypeScript 的版本是 3.9.10。

### 安装 3.9.10 版本的 TypeScript

```
yarn add typescript@3.9.10
```

### 切换 VS Code 使用的 TypeScript 版本

点击 VS Code 底部工具栏的版本号信息（或者 cmd + shift + p 搜索切换 TypeScript 版本），从而实现 “use VS Code's Version” 和 “use WorkSapce version” 两者的切换。

我们也可以手动切换，在当前应用目录下的 `.vscode/setting.json` 内添加如下命令，配置 VS Code 默认使用应用目录下安装的 TypeScript 版本提供的语法解析和类型检测服务。

```json
{
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

**推荐使用工作区（WorkSpace）的 TypeScript 版本**

## 推荐阅读

### 配置文件

- [了不起的 tsconfig.json 指南](https://mp.weixin.qq.com/s?__biz=MjM5MDc4MzgxNA==&mid=2458455122&idx=1&sn=9f3431a2bbac6cd1d671f4aa90a934de&chksm=b1c22c7b86b5a56d65e61bab63b7a1d83e2b4689a6cb731160f52743ded5a83bedf032398f4a&scene=21)
- [Typescript 配置文件详解](https://blog.cjw.design/blog/old/typescript)
- [tsconfig.json](https://www.tslang.cn/docs/handbook/tsconfig-json.html)
- [编译选项](https://www.tslang.cn/docs/handbook/compiler-options.html)

### target、module

- [Typescript 4.5 —— 浅谈模块能力增强](https://zhuanlan.zhihu.com/p/425740447)
- [Typescript confusion: tsconfig.json module, moduleResolution, target & lib explained](https://medium.com/@tommedema/typescript-confusion-tsconfig-json-module-moduleresolution-target-lib-explained-65db2c44b491)
