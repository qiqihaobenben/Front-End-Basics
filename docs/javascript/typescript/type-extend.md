# TypeScript 类型声明文件

## 声明

在 TypeScript 中安全地使用 JavaScript 的库，关键的步骤就是使用 TypeScript 中的一个 declare 关键字。通过使用 declare 关键字，我们可以声明全局的变量、方法、类、对象。

### declare 变量

在运行时，前端代码 `<script>` 标签会引入一个全局的库，再导入全局变量。此时，如果想安全地使用全局变量，那么就需要对变量的类型进行声明。

声明变量的语法： `declare (var|let|const) 变量名称:变量类型`

```ts
declare let a: string
declare const b: number
a = 'a'
a = 1 // 报错
b = 2 // 报错，const 声明不能再赋值
```

### declare 函数

声明函数的语法与声明变量的语法相同，不同的是 declare 关键字后需要跟 function 关键字。

```ts
/* 报错，只需声明，不需要实现
declare function toString(x: number) {
  return String
} */
// 正确的语法
declare function toString(x: number): string
const x = toString(1)
```

### declare 类

声明类时，也是只需要声明类的属性、方法的类型即可。

```ts
declare class Person {
  public name: string
  private age: number
  constructor(name: string)
  getAge(): number
}

const person = new Person('tom')
const myName = person.name // => string
const myAge = person.getAge() // => number
const age = person.age // 报错，属性“age”为私有属性，只能在类“Person”中访问
```

**注意：使用 declare 关键字时，我们不需要编写声明的变量、函数、类的具体实现（因为变量、函数、类在其他库中已经实现了），只需要声明其类型即可，否则会报错。**

### declare 枚举

声明枚举只需要定义枚举的类型，并不需要定义枚举的值，这其实就是枚举中的外部枚举（Ambient Enums）

```ts
declare enum Direction {
  Up,
  Down,
  Left,
  Right,
}

const direction = [Direction.Up, Direction.Down]
```

**注意：声明枚举仅用于编译时的检查，编译完成后，声明文件中的内容在编译结果中会被删除。**

例如上面的代码，编译完成后，相当于仅剩下了 `const direction = [Direction.Up, Direction.Down]`，这里数组中的 Direction 表示引入的全局变量。

### declare 模块

ES6 之前，TypeScript 提供了通过使用 module 关键字声明一个内部模块的模块化方案，但是由于 ES6 也使用了 module 关键字，为了兼容 ES6，所以 TypeScript 使用 namespace 替代了原来的 module，并更名为命名空间。**需要注意：目前，任何使用 `module` 关键字声明一个内部模块的地方，都应该使用 `namespace` 关键字进行替换。**

TypeScript 与 ES6 一样，任何包含顶级 import 或 export 的文件都会被当作一个模块。我们可以通过声明模块类型，为缺少 TypeScript 类型定义的三方库或者文件补齐类型定义。

声明模块的语法：`declare module '模块名' {}`，在模块声明内部，只需要使用 export 导出对应库的类、函数即可。

```ts
// lodash.d.ts
declare module 'lodash' {
  export function first<T extends unknown>(array: T[]): T
}

// index.ts
import { first } from 'lodash'
first([1, 2, 3]) // => number
```

### declare 文件

在使用 TypeScript 开发前端应用时，可以通过 import 关键字导入文件，比如先使用 import 导入图片文件，再通过 webpack 等工具处理导入的文件。但是，因为 TypeScript 并不知道通过 import 导入的文件是什么类型，所以需要使用 declare 声明导入的文件类型。

```ts
// 可以使用模块通配符 *.xxx 匹配一类文件
declare module '*.jpg' {
  const src: string
  export default src
}
declare module '*.png' {
  const src: string
  export default src
}
```

上面的代码标记的图片文件的默认导出类型是 string，通过 import 使用图片资源时，TypeScript 会将导入的图片识别为 string 类型，因此也就可以把 import 的图片赋值给 src 属性，因为它们的类型都是 string，是匹配的。

### declare namespace

不同于声明模块，命名空间一般用来表示具有很多子属性或者方法的全局对象变量。

一般我们可以将声明命名空间简单看作是声明一个更复杂的变量。

```ts
declare namespace $ {
  const version: number
  function ajax(settings?: any): void
}

$.version // => number
$.ajax()
```

在上面的例子中，因为我们声明了全局导入的 jQuery 变量 `$`，所以可以直接使用 `$` 变量的 version 属性以及 ajax 方法。

### 声明文件

在 TypeScript 中，以 .d.ts 为后缀的文件为声明文件。在声明文件时，我们只需要定义第三方类库所暴露的 API 接口即可。

声明文件中有类型、值、命名空间 3 个核心概念：

- 类型（以下每一个声明都创建了一个类型名称）
  - 类型别名声明；
  - 接口声明；
  - 类声明；
  - 枚举声明；
  - 导入的类型声明
- 值（值就是在运行时表达式可以赋予的值）
  - var、let、const 声明；
  - namespace、module 包含值的声明；
  - 枚举声明；
  - 类声明；
  - 导入的值；
  - 函数声明
- 命名空间
  在命名空间中，也可以声明类型。比如 `const x: A.B.C` 这个声明，这里的类型 C 就是在 A.B 命名空间下的。

#### 使用声明文件

安装 TypeScript 依赖后，一般我们会顺带安装一个 lib.d.ts 声明文件，这个文件包含了 JavaScript 运行时以及 DOM 中各种全局变量的声明。lib.d.ts 文件内容如下：

```ts
// typescript/lib/lib.d.ts
/// <reference no-default-lib="true"/>
/// <reference lib="es5" />
/// <reference lib="dom" />
/// <reference lib="webworker.importscripts" />
/// <reference lib="scripthost" />
```

其中，`///` 是 TypeScript 中三斜线指令，后面的内容类似于 XML 标签的语法，用来指代引用其他的声明文件。

通过三斜线指令，可以更好地复用和拆分类型声明。`no-default-lib="true"` 表示这个文件是一个默认库。而最后 4 行的 `lib="..."` 表示引用内部的库类型声明。

#### 使用 @types

[Definitely Typed](https://github.com/DefinitelyTyped/DefinitelyTyped) 是最流行的高质量 TypeScript 声明文件类库，正是因为有社区维护的这个声明文件类库，大大简化了 JavaScript 项目迁移 TypeScript 的难度。

目前，社区已经记录了 90% 的 JavaScript 库的类型声明，意味着如果我们想使用的库有社区维护的类型声明，那么就可以通过安装类型声明文件直接使用 JavaScript 编写的库了。

具体操作：首先，通过[此链接](https://www.typescriptlang.org/dt/search?search=)搜索你想要导入的库的类型声明，如果有社区维护的声明文件。然后，只需要安装 @types/xxx 就可以在 TypeScript 中直接使用它了。

### 类型合并

因为 Definitely Typed 是由社区人员维护的，如果原来的第三方库升级，那么 Definitely Typed 所导出的第三方库的类型定义想要升级还需要经过 PR、发布的流程，就会导致无法与原库保持完全同步。针对这个问题，在 TypeScript 中，可以通过类型合并、扩充类型定义的技巧临时解决。

#### 合并接口

最简单、常见的声明合并是接口合并，**需要注意的是接口的非函数成员类型必须完全一样**

```ts
interface Person {
  name: string
}
interface Person {
  // name: number; 报错，类型不同
  age: number
}

// 相当于
interface Person {
  name: string
  age: number
}
```

对于函数成员而言，每个同名的函数声明都会被当做这个函数的重载。**需要注意的是：接口内部的函数声明优先级按照顺序确定，接口之间的函数声明后面声明的接口具有更高的优先级，如果函数声明指定的参数是字面量类型，优先级最高**

```ts
interface Obj {
  identity(val: any): any
}
interface Obj {
  identity(val: number): number
}
interface Obj {
  identity(val: boolean): boolean
}

// 相当于
interface Obj {
  identity(val: boolean): boolean
  identity(val: number): number
  identity(val: any): any
}

const obj: Obj = {
  identity(val: any) {
    return val
  },
}
const t1 = obj.identity(1) // => number
const t2 = obj.identity(true) // => boolean
const t3 = obj.identity('a') // => any
```

#### 合并 namespace

合并 namespace 与合并接口类似，命名空间的合并也会合并其**导出成员的属性**，需要注意的是导出的成员是不能重复的。另外不同的是，非导出成员仅在原命名空间内可见。

```ts
namespace Person {
  const age = 18
  export function getAge() {
    return age
  }
}
namespace Person {
  export function getMyAge() {
    return age // TS2304: Cannot find name 'age'
  }
}
```

在上面的例子，同名的命名空间 Person 中，有一个非导出的属性 age，在第二个命名空间 Person 中没有 age 属性却引用了 age，所以 TypeScript 报错找不到 age。

#### 合并 namespace 和 函数

同名的 namespace 和 函数 合并，命名空间中导出的成员相当于给 函数 添加属性。

```ts
function Lib() {}
namespace Lib {
  export let version = '1.0'
}

console.log(Lib.version)
```

#### 类不可合并

定义一个类类型，相当于定义了一个类，又定义了一个类的类型。因此，对于类这个既是值又是类型的特殊对象不能合并。

### 扩充模块

除了可以通过接口和命名空间合并的方式扩展原来声明的类型外，还可以通过扩展模块或扩展全局对象来增强类型系统。

JavaScript 是一门动态类型的语言，通过 prototype 可以很容易地扩展原来的对象。

但是，如果直接扩展导入对象的原型链属性，TypeScript 会提示没有该属性的错误，所以还需要扩展原模块的属性。

```ts
// person.ts
export class Person {}

// index.ts
import { Person } from './person'

declare module './person' {
  interface Person {
    greet: () => void
  }
}
Person.prototype.greet = () => {
  console.log('Hi!')
}
```

类似上面的代码，对于导入的第三方模块，同样可以使用这个方法扩充原模块的属性。

### 扩充全局

全局模块指的是不需要通过 import 导入即可使用的模块，如全局的 window、document 等。

```ts
declare global {
  interface Array<T extends unknown> {
    getLen(): number
  }
}
Array.prototype.getLen = function () {
  return this.length
}
```

## 推荐阅读

- [声明文件](https://ts.xcatliu.com/basics/declaration-files)
