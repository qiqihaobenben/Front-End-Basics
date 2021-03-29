# 【译】TypeScript 为何如此重要？

原文链接：[TypeScript, why is so important?](https://www.warambil.com/typescript-why-is-so-important)

## 类型为什么会存在？

众所周知的经典编程语言，例如：Pascal、C、C++等都是强类型语言，这就意味着这些语言，必须在编译时设置更严格的类型规则。

每次你声明变量或函数参数时，必须先明确标明它们的类型，然后再使用。这个概念背后的原因可以追溯到很久以前，即所谓的为了确保程序有意义的类型理论。

硬件无法区分类型。类型可以看作是人抽象出来的东西，可以让编程者实现更高层次的思考，让代码更加简洁明了。

此外，从编译器的角度来看，类型还有一些优势，例如：便于优化。在编译阶段进行类型检查可以让编译器更有效率的执行机器指令。安全是另一个重要的考量，强类型系统可以帮助编译器提早发现错误。

随着像是 Basic，JavaScript，PHP，Python 等解释型语言新秀的出现，它们都是在运行时进行类型检查。编程者可以不用编译它们的代码，语言变得更灵活智能，可以基于上下文和数据进行类型检测。

## 回归初心

大家不应该就关于强类型和弱类型孰优孰劣展开一场新争论，我们必须了解，每一种语言都是基于某个特定的目的被设计创造出来的，没有人会预料到像是 JavaScript 这样的脚本语言会如此流行并广泛的应用于开发商业应用。

给像 JavaScript 这样的弱类型语言增加强类型的能力，不仅可以帮助开发团队写出整洁的自解释代码，而且能解决一个根本问题：在运行时之前的编译阶段捕获类型错误。

## TypeScript 是什么？

JavaScript 是一个解释型或者说动态编译语言，开发人员在运行程序之前不需要编译代码。因为，我们称 TypeScript 为**JavaScript 的类型超集**，意思是说它给开发人员提供了一组新的语法，可以给 JavaScript 这种弱类型语言加入类型。

举个例子，当我们在 JavaScript 中声明一个变量时，是不需要指定类型的。但在 TypeScript 中声明变量就必须指定一个类型，当然你也可以不设置类型直接赋值。

```ts
let isDone: boolean
let decimal: number
let big: bigint
let color: string
let name = 'John'
```

跟 JavaScript(.js)不同，TypeScript 文件后缀使用 .ts 扩展名。浏览器是不识别 .ts 文件，所以使用时必须提前把 TS 代码转换成 JavaScript 代码。这个转换过程被称为转译，编译和转译的微小差别在于：

- 编译是把源码转变成另一种语言
- 转译是把源码转变另一个相同抽象层级的语言

实话实说，我必须澄清这个概念，因为我已经有很多次碰到这两个容易被混淆的概念了。不过，为了便于阅读，就连 TypeScript 的官方文档也一直把预处理过程叫做编译。

## 安装

我们可以使用 `npm` 和 `yarn` 安装 TypeScript

```
yarn add typescript
```

或

```
npm install typescript
```

然后，我们就可以使用 `tsc` 命令编译 TS 文件。

```
npx tsc
```

## 配置

在我们的项目中新建 TS 文件，并然后在命令行中用 `tsc` 编译。我们新建一个文件叫做 `app.ts` 。

```ts
function add(num1: number, num2: number): number {
  return num1 + num2
}
```

然后再命令行执行：

```
npx tsc app.ts
```

会生成一个如下内容的名字叫做 app.js 的文件。

```js
function add(num1, num2) {
  return num1 + num2
}
```

不过，有更简单的方式。最简单的一种是在你 JS 根目录创建一个 tsconfig.json 的文件，让编译器通过此配置执行。

```
{
  "compilerOptions": {
    "target": "es6",
    "rootDir": "./src",
    "outDir": "./dist",
    "module": "commonjs",
    "removeComments": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}
```

此配置文件按照部分划分，如下我们能看到一个最基本的配置文件有以下选项：

- target: 它决定编译后的 JS 版本: ES3,ES5,ES6……
- rootDir: 它决定你源代码（.ts 文件）的根目录
- outDir: 它决定编译后的 JS 文件的输出目录
- module: 它设定了程序的模块系统：commonjs,UMD,AMD……
- removeComments: 编译代码时移除注释，被认为是最佳实践
- include: 它决定源代码所在的目录
- exclude: 它决定了在编译过程中，需要排除那些文件和文件夹

给 TypeScript 定义新的配置文件后，我们就能在 src 文件夹下新建多个 TypeScript 文件，然后，我们只需要在命令行运行 `npx tsc` ，就能编译文件并且把生成的文件放到输出文件夹。

我们也可以在 `package.json` 中指定一个 `tsc` 任务，甚至可以使用 `watch` 选项让文件在被改动后自动运行 `tsc`。

根据你使用的技术和项目类型，可以有多种方式设置 TypeScript ，在本文中，我们不会展示所有可能的配置方案，大家如果想了解更多的选项，鼓励大家去看一下[官方文档](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)。

## 怎么使用 TypeScript ？

TypeScript 是一个在软件开发过程中帮助开发者给数据类型添加更严格的约束的工具。他必须跟其他好的实践一起配合例如适当使用 `let` 或 `const` 替换 `var` 进行局部变量声明。

### 基础类型

让我们来回顾一下 TS 提供的类型。

#### Boolean、Number、String

基本类型的声明如下：

```ts
let isDone: boolean = false
let decimal: number = 6
let hex: number = 0xf00d
let binary: number = 0b1010
let octal: number = 0o744
let big: bigint = 100n
let color: string = 'blue'
```

#### Arrays

数组类型有两种写法：

```ts
let list: number[] = [1, 2, 3]
```

或者

```ts
let list: Array<number> = [1, 2, 3]
```

#### 元组

比如我们要创建第一个元素是 `string` 和 第二个元素是 `number` 的数组这样或者类似的场景，我们就可以使用 `Tuple`。

```ts
let x: [string, number]
x = ['hello', 10]
```

重要的是要理解 TS 对类型及其声明的顺序施加了严格的控制，所以，基于上面的定义，下面的代码就会报错。

```ts
x = [10, 'hello'] // WRONG
```

#### 枚举

与其他语言（例如：C 或 C++）一样，TypeScript 也具有用于声明多个常数的枚举类型。跟其他语言不同的是，TS 的枚举更灵活。

```ts
enum Color {
  Red,
  Green,
  Blue,
}

let c: Color = Color.Green
```

枚举从 0 开始，所以 Red = 0 , Green = 1 , Blue = 2 ，不过在 TS 中，你可以通过下面的方式改变顺序：

```ts
enum Color {
  Red = 1,
  Green,
  Blue,
}
```

或者给每个常量分配不同的数字

```ts
enum Color {
  Red = 2,
  Green = 6,
  Blue = 5,
}
```

甚至可以给每个常量分配字符串类型的值

```ts
enum Color {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right',
}
```

### 特殊类型

现在，我们已经知道了如何定义基本类型，但是，在弱类型语言中添加强类型校验会在很多方面产生巨大影响。

例如，我们正在跟 DOM 进行交互，想从一个 HTML 元素中获取 value。我们可以指明元素的类型，但是要确保，从元素上获取 value 之前，必须确保它存在。

```ts
const elem = document.getElementById('elementId')! as HTMLInputElement
```

最后的感叹号是告诉 TS，虽然 TS 不能确定元素上是否存在这个值，但是我们可以接受这个风险。

另一个有趣的例子是，当我们需要指明函数接受到的参数可能是字符串或者数字时，换句话说，我们传参可以是字符串或数字。

对于这个场景，我们可以使用管道符（|）合并所有可能接收的类型：

```ts
function combine(a: number | string, b: number | string): void {
  //logic to validate types and perform operations
}
```

这个管道还可以用来指明作为参数的特殊的字符串

```ts
function foo(color: 'yellow' | 'brown'){...}
```

上面的例子中，函数接收的字符串参数必须是 yello 或 brown 之一。

函数的返回类型也是需要重点关注的，如果我们想创建一个抛出错误的函数，它的返回值是什么类型的？

就像这个例子， TS 有一种类型叫做：never。这个类型是指不会发生。不过，它经常被用作函数抛出异常。

```ts
function error(msg: string): never {
  throw new Error('msg')
}
```

另外，函数没有返回应该用 `void` 声明。

```ts
function message(msg: string): void {
  console.log('msg')
}
```

如果不知道数据是什么类型的，我们可以使用 `unknown` 关键字。在下面的例子中，TypeScript 不会控制它的类型，不过，必须在分配给其他类型前进行类型验证。

```ts
let input: unknown

/before assigning it we should check its type
if(typeof input === "string") {
  let name: string = input
}
```

除了在赋值之前进行类型检查外，我们还可以给它的类型转换为我们知道的类型。在 TypeScript 的强制转换如下：

```ts
let myinput: unknown
let mylength: number = (<string>myinput).length
```

或者

```ts
let myinput: unknown
let mylength: number = (myinput as string).length
```

有些情况我们不想让 TS 进行类型检查，比如，当我们使用一个不能控制的外部的库，或者我们需要定义一个有可能返回任意类型的函数。对于这些情况，我们可以使用 `any`。

```ts
declare function getValue(key: string): any
const str: string = getValue('test')
```

### 接口

跟其他语言类似，接口与定义类型相关，创建接口类型的对象时，必须遵守接口类型的定义。

所以，我们假设一个函数接收一个 user 对象。在使用它之前我们可以先创建一个接口来约束对象的结构或者说是规则。

```ts
interface User {
  name: string
  age: number
}

function displayPersonalInfo(user: User) {
  console.log(`Name: ${user.name} - Age: ${user.age}`)
}
```

创建接口时，可以添加一些修饰符，类似 `?` 表明属性可能是 `null`，也可以使用 `readonly` 关键字设置一个不可修改的属性。

```ts
interface Square {
  color?: string
  width?: number
}

interface Point {
  readonly x: number
  readonly y: number
}

let square: Square = {
  width: 14,
}
```

顺便说一下，`readonly` 是一个有趣的关键字，可以应用于其他类型。例如，存在一个 `ReadonlyArray`定义，可以让开发者创建一个元素不能修改的数组。

```ts
let a: number[] = [1, 2, 3, 4]
let ronumbers: ReadonlyArray<number> = a

ronumbers[0] = 4 //WRONG! It cannot be assigned

//But it could be used for iterating over its values for reading purposes
for (const num of ronumbers) {
  console.log(num)
}
```

### 泛型

最后要重点介绍面向对象语言最关键的特性之一：泛型，在 TypeScript 中也是存在的。

可复用组件是每一种现代强类型语言的基础，引入了强类型语言的 JavaScript 也是如此，我们必须给开发者一种可以定义对于不同的类型数据有相同处理逻辑的函数。

对于使用过像是 C++,C#,Kotlin,Java 甚至 Rust 的人来说，他们对这个概念非常熟悉。

对于其他开发人员，我们还是要解释一下，泛型是一种声明数组、类或函数的方法，数组，类或函数在声明过程中使用了他们不知道的类型。

泛型的用法是一对 `<>`，中间可以包含任何字母，这些字符在之后的实现逻辑中作为标记，并在定义发生时被实际类型替换。

```ts
function myMax<T>(x: T, y: T): T {
  return x > y ? x : y
}

const intMax = myMax<number>(12, 50)

console.log(intMax)
```

上面的例子中，我们定义了一个比较两个值并返回最大的那一个的函数，注意，实际类型（number）是在后面才传入的。

## 总结

我们可以总结一下 TypeScript ，作为一个静态类型的校验语言，给 JavaScript 这个前端语言增加了一层逻辑让它更健壮。仔细观察，我们还可以了解到大多数语言是如何添加类似的特性的：函数式编程、lambda 函数，强类型，不可变的变量等。

这是一个好现象，因为它表明了软件行业日趋成熟，并且对于入行开发的新人及后来人来说会更好。
