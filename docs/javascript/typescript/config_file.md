# tsconfig.json 配置文件

tsconfig.json 是 TypeScript 项目的配置文件。如果一个目录下存在一个 tsconfig.json，则说明该目录是 TypeScript 项目的根目录。

通常 tsconfig.json 文件主要包含两部分内容：**指定待编译文件**和**定义编译选项**。

在简单的练手时，我们可以使用 `tsc` 命令编译少量的 TypeScript 文件，例如

```
tsc --outFile demo.js --target es3 --module amd index.ts
```

但是如果实际开发的项目，就需要使用 tsconfig.json，将需要用到的配置都写进 tsconfig.json，这样就不用每次编译都手动输入配置，也方便团队协作开发。

## 初始化 tsconfig.json

1. 手动在项目根目录（或其他）创建 tsconfig.json 文件并填写配置；
2. 通过 `tsc --init` 初始化 tsconfig.json 文件。

## 指定需要编译的目录

在不指定输入文件的情况下执行 `tsc` 命令，默认从当前目录开始编译，编译所有 `.ts` 文件，并且从当前目录开始查找 tsconfig.json 文件，并逐级向上级目录搜索。

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

`compilerOptions` ：配置编译选项

若 `compilerOptions` 属性被忽略，则编译器会使用默认值。可以查看[编译选项文档](https://www.typescriptlang.org/docs/handbook/compiler-options.html)

#### 常用配置

- incremental：类型 `Boolean`，TS编译器在第一次编译之后会生成一个储存编译信息的文件，第二次编译会在第一次的基础上进行增量编译，可以提高编译的速度。默认值分为两种情况，当 `composite` 为 `true` 时，默认值为 `true`，否则为 `false`
- tsBuildInfoFile：增量编译文件的存储位置
- composite：类型 `Boolean`，确保 TypeScript 可以确定在哪里可以找到引用项目的输出以编译项目。默认为 `true` TODO
- diagnostics：类型 `Boolean`，打印诊断信息，默认值为 `false`
- extendedDiagnostics：类型 `Boolean`，显示详细的诊断信息，默认值为 `false`
- target：目标语言版本
- module：类型 `String`，指定生成哪个模块系统代码，可以为 `"none"`、`"commonjs"`、`"amd"`、`"system"`、`"umd"`、`"es6"`/`"es2015"`、`es2020`、`es2022`、`esnext`、`node12` 或者 `nodenext`。默认值为 `target === "ES3" or "ES5" ? "CommonJS" : "ES6/ES2015"`
- moduleResolution：类型 `String`，模块解析策略，默认值为 `module === "AMD" or "UMD" or "System" or ES6/ES2015 ? "Classic" : "Node"`
- outFile：将多个相互依赖的文件生成一个文件，可以用在 AMD 模块中，即开启时应设置 `"module": "AMD"`
- lib：TS需要引用的库，即声明文件包，es5 默认引用 DOM、ES5、ScriptHost，es6 默认引用DOM、ES6、DOM.Iterable、ScriptHost。 如果需要使用 es 的高级版本特性，通常都需要配置，可能的值有： ► ES5 ► ES6 ► ES2015 ► ES7 ► ES2016 ► ES2017 ► ES2018 ► ESNext ► DOM ► DOM.Iterable ► WebWorker ► ScriptHost ► ES2015.Core ► ES2015.Collection ► ES2015.Generator ► ES2015.Iterable ► ES2015.Promise ► ES2015.Proxy ► ES2015.Reflect ► ES2015.Symbol ► ES2015.Symbol.WellKnown ► ES2016.Array.Include ► ES2017.object ► ES2017.Intl ► ES2017.SharedMemory ► ES2017.String ► ES2017.TypedArrays ► ES2018.Intl ► ES2018.Promise ► ES2018.RegExp ► ESNext.AsyncIterable ► ESNext.Array ► ESNext.Intl ► ESNext.Symbol
- allowJs：类型 `Boolean` ，允许编译器编译 JS 或 JSX 文件，默认值 `false`
- checkJs：类型 `Boolean`，允许在 JS 文件中报错，通常与 allowJS 一起使用，默认值为 `false`
- allowSyntheticDefaultImports：类型 `Boolean` ，允许从没有设置默认导出的模块中默认导入。这并不影响代码的输出，仅为了类型检查。默认值有两种情况：1、 `module === "system"` 或设置了 `esModuleInterop` 且 `module` 不为 `es2015`/`esnext` 时，默认值为 `true`；2、其他情况下默认值为 `false`。具体含义可以查看[TypeScript 中的多种 import 解义](https://tasaid.com/blog/2019022017450863.html)
- esModuleInterop：类型 `Boolean`，允许 export= 导出，由 import from 导入 TODO
- outDir：指定输出目录
- rootDir：指定 TODO
- declaration：类型 `Boolean`，构建 ts 文件时生成相应的 `.d.ts` 声明文件，开启后会自动生成声明文件.默认值分为两种情况，当 `composite` 为 `true` 时，默认值为 `true`，否则为 `false`
- declarationDir：类型 `String`，指定生成的声明文件存放目录，默认输出路径为生成的目标文件相同位置
- declarationMap：类型 `Boolean`，为声明文件生成 sourceMap，默认值为 `false`
- emitDeclarationOnly：类型 `Boolean`，只生成声明文件，而不会生成js文件，默认值为 `false`
- sourceMap：生成目标文件的 sourceMap 文件
- inlineSourceMap：类型 `Boolean`，生成单个 sourcemaps 文件，而不是将 sourcemaps 生成不同的文件。默认值为 `false`
- inlineSources：类型 `Boolean`，生成目标文件的 inlineSource，inlineSource 会包含在生成的 js 文件中，默认为 `false`，设置为 `true` 时要求同时设置 --inlineSourceMap 或 --sourceMap 属性
- mapRoot：类型 `String`，为调试器指定 sourcemap 文件的路径，而不是使用生成时的路径。当 .map 文件是在运行时指定的，并且不同于生成的目标文件地址时使用这个选项，指定的路径会嵌入到 sourceMap 里告诉调试器到哪里去找它们。
- isolatedModules：类型 `Boolean`，将每个文件作为单独的模块（与 "ts.transpileModule" 类似），默认值为 `false`
- typeRoots：类型 `Array<String>`，声明文件包目录，默认是 node_modules/@types，如果 typeRoots 指定，则仅包括 typeRoots 下面的包。
- types：类型 `Array<String>`，加载的声明文件包，如果指定 types 属性，将仅检索指定名称的 @types 包。当 types 是 `[]` 时，表示禁止自动包含任何 @types 包。
- forceConsistentCasingFileNames：类型 `Boolean`，禁止对同一文件使用大小写不一致的引用，默认值为 `false`
- removeComments：删除注释
- noEmit：类型 `Boolean`，不输出文件，即编译后不会生成任何 JS 文件，默认为 false
- noEmitOnError：类型 `Boolean`，发生错误时不输出任何文件，默认为 false
- noEmitHelpers：类型 `Boolean`，不在输出文件中生成用户自定义的帮助函数，如 `__extends`，减小体积，需要额外安装，常配合 importHelpers 一起使用
- importHelper：类型 `Boolean`，通过 tslib 引入 helper 函数（比如 extends,rest等），文件必须是模块。tslib是TypeScript运行时库，其中包含所有 TypeScript 辅助函数，需要安装 tslib 依赖。
- disableSizeLimit：类型 `Boolean`，取消 JavaScript 代码体积大小不能超过 20M 的限制，默认为 `false`
- downlevelIteration：类型 `Boolean`，降级遍历器实现，如果 `target` 是 es3/5，那么遍历器会有降级的实现
- strict：开启所有严格的类型检查
- alwaysStrict：类型 `Boolean`，以严格模式解析并为每个源文件插入 `"use strict";` 语句，默认值为 `false`
- noImplicitAny：类型 `Boolean`不允许隐式的 any 类型，默认值为 `false`
- strictNullChecks：不允许把 null、undefined 赋值给其他类型的变量
- strictFuntionTypes：不允许函数参数双向协变
- strictPropertyInitialzation：类的实例属性必须初始化
- strictBindCallApply：严格的 bind/call/apply 检查
- noImplicitThis：不允许 this 有隐式 any 类型
- noUnusedLocals：检查只声明但未使用的局部变量（只提示不报错）
- noUnusedParameters：检查未使用的函数参数（只提示不报错）
- noFallthroughCasesInSwitch：类型 `Boolean`，报告 switch 语句的 fallthrough 错误（即，不允许 switch 的 case 语句贯穿），默认值为 false
- noImplicitReturns：类型 `Boolean`，当函数的所有返回路径代码都没有返回值时报错，默认值为 `false`
- allowUmdGlobalAccess：类型 `Boolean`，允许在模块中用全局变量的方式访问 umd 模块，默认值为 `false`
- allowUnreachableCode：类型 `Boolean`，不报告执行不到的代码错误，默认值为 `false`（不建议修改此选项）
- allowUnusedLabels：类型 `Boolean`，不报告未使用的标签错误，默认为 `false`
- baseUrl：类型 `String`，解析非相对模块名的基准目录，默认是当前目录。实践证明，当 ts 中 import 引用非相对路径的模块，例如 `import "foo"`，ts 会首先查询 node_modules 目录，如果没有查找到需要的，就会根据 baseUrl 设置的路径目录查找该模块。可以查看[模块解析文档](https://www.tslang.cn/docs/handbook/module-resolution.html#base-url)了解详情
- paths：路径映射，相对于 baseUrl
- rootDirs：将多个目录放在一个虚拟目录下，用于运行时，即编译后引入文件的位置可能发生变化
- listEmittedFiles：类型 `Boolean`，打印编译后生成的文件名称，默认值为 `false`
- listFiles：类型 `Boolean`，在编译过程中打印文件名称（包括引用的声明文件），默认值为 `false`
- locale：类型 `String` 用于显示错误消息的语言环境，例如 zh-CN，默认值根据环境确定。
- jsx：类型 `"react"|preserve|"react-native"`，在 .tsx 文件里支持 JSX，默认值为 `"preserve"`
- jsxFactory：类型 `String`，指定 `"jsx": "react"`时，使用的 JSX 工厂函数，比如 `React.createElement` 或 `h`，配合 `jsx` 属性一起用。默认值为 `React.createElement`
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

### 命令函参数优先级

`tsc` 的命令行上指定的编译选项具有更高的优先级，会覆盖 tsconfig.json 中的相应选项。

### files、include、exclude

如果一个 glob 模式里的某部分只包含 `*` 或 `.*`，那么仅有支持的文件扩展名类型被包含在内（比如默认 `ts`、`tsx` 和 `.d.ts`，如果 `"allowJs": true`，那么，还包含 `.js` 和 `.jsx`）。

如果 `files` 和 `include` 都没有被指定，编译器默认包含当前目录和子目录下所有的 TypeScript 文件（`.ts`、`.tsx` 和 `.d.ts`，如果`"allowJs": true`，那么，还包含 `.js` 和 `.jsx`），排除在 `exclude` 里指定的文件。

如果指定了 `files` 和 `include`，编译器会将它们包含的文件取并集。不过使用 `outDir` 指定的目录下的文件永远会被编译器排除，除非明确地使用 `files` 将其包含进来（这时就算用 `exclude` 排除也没用）。

使用 `include` 引入的文件可以使用 `exclude` 属性过滤，但是通过 `files` 属性明确指定的文件始终会被包含在内，不管 `exclude` 如何设置。如果没有特殊指定，`exclude` 默认情况下会排除 `node_modules`、`bower_components`、`jspm_packages` 和 `<outDir>` 目录。

编译器不会去引入那些可能做为输出的文件；比如，假设我们包含了 `index.ts`，那么 `index.d.ts` 和 `index.js` 会被排除在外。通常来讲，不推荐只用扩展名的不同来区分同目录下的文件。

### types

只有当你使用了全局环境声明的时候，自动包含才重要，如果没有用到全局声明的时候，就可以不需要自动包含，使用 import "module" 的时候，ts 会自动去 node_modules & node_modules/@types 文件夹查找对应声明文件包。

### jsx

jsx 三种类型的区别：

preserve 模式生成的代码中会保留 JSX 以供其他转换操作（例如 Babel）进一步使用，另外输出的文件具有 .jsx 文件扩展名。

react 模式会生成 `React.createElement`（`React` 标识符是写死的硬编码，所以必须保证 React(大写的 R) 是可用的），在使用之前不需要在进行转换操作了，输出文件的扩展名为 .js

react-native 模式相当于 preserve 它也保留了所有的 JSX，但是输出文件的扩展名是 `.js`

### module

- 只有 `"AMD"` 和 `"System"` 能和 --outFile 一起使用。
- `"ES6"` 和 `ES2015` 可使用在 `target` 为 `"ES5"` 或更低的情况下

## 推荐阅读

- [了不起的 tsconfig.json 指南](https://mp.weixin.qq.com/s?__biz=MjM5MDc4MzgxNA==&mid=2458455122&idx=1&sn=9f3431a2bbac6cd1d671f4aa90a934de&chksm=b1c22c7b86b5a56d65e61bab63b7a1d83e2b4689a6cb731160f52743ded5a83bedf032398f4a&scene=21)
- [tsconfig.json](https://www.tslang.cn/docs/handbook/tsconfig-json.html)
- [编译选项](https://www.tslang.cn/docs/handbook/compiler-options.html)
