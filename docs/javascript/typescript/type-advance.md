# TypeScript 高级类型

## 联合类型（Unions）

联合类型用来表示变量、参数的类型不是单一原子类型，而可能是多种不同的类型的组合。

声明的类型并不确定，可以为多个类型中的一个,除了可以是 TS 中规定的类型外，还有字符串字面量联合类型、数字字面量联合类型

```typescript
let a: number | string = 1

// 字符串字面量联合类型
let b: 'a' | 'b' | 'c' = 'a'

// 数字字面量联合类型
let c: 1 | 2 | 3 = 1
```

### 对象联合类型

对象的联合类型，只能取两者共有的属性，所以说对象联合类型只能访问所有类型的交集

```typescript
// 接上文DogInterface和CatInterface
class Dog implements DogInterface {
  run() {}
  eat() {}
}

class Cat implements CatInterface {
  jump() {}
  eat() {}
}
enum Master {
  Boy,
  Girl,
}
function getPet(master: Master) {
  // pet为Dog和Cat的联合类型，只能取两者共有的属性，所以说联合类型在此时只能访问所有类型的交集
  let pet = master === Master.Boy ? new Dog() : new Cat()
  pet.eat()
  // pet.run() // 不能访问，会报错
  // if(typeof pet.run === 'function') { // 报错 类型“Dog | Cat”上不存在属性“run”。
  //   pet.run()
  // }
  /**
   * 只能使用 in
   */
  if ('run' in pet) {
    pet.run()
  }
  return pet
}
```

上面代码中，使用 `typeof pet.run === 'function'` 这个类型守卫会报错的原因是因为 pet 的类型可能 Dog，也有可能是 Cat，这就意味着可能会通过 Cat 类型获取 run 属性，但是 Cat 类型没有 run 属性定义，所以这种情况下，需要使用基于 in 操作符判断的类型守卫。

### 可区分的联合类型

这种模式是结合了联合类型和字面量类型的类型保护方法，一个类型如果是多个类型的联合类型，并且每个类型之间有一个公共的属性，我们就可以凭借这个公共属性来创建不同的类型保护区块。

**核心是利用两种或多种类型的共有属性，来创建不同的代码保护区块**

下面的函数如果只有 Square 和 Rectangle 这两种联合类型，没有问题，但是一旦扩展增加 Circle 类型，类型校验就不会正常运行，而且也不报错，这个时候我们是希望代码有报错提醒的。

```typescript
interface Square {
  kind: 'square'
  size: number
}
interface Rectangle {
  kind: 'rectangle'
  width: number
  height: number
}
interface Circle {
  kind: 'circle'
  r: number
}
type Shape = Square | Rectangle | Circle

// 下面的函数如果只有Square和Rectangle这两种联合类型，没有问题，但是一旦扩展增加Circle类型，不会正常运行，而且也不报错，这个时候我们是希望代码有报错提醒的。
function area(s: Shape) {
  switch (s.kind) {
    case 'square':
      return s.size * s.size
      break
    case 'rectangle':
      return s.width * s.height
      break
  }
}

console.log(area({ kind: 'circle', r: 1 }))
// undefined，不报错，这个时候我们是希望代码有报错提醒的
```

如果想要得到正确的报错提醒，第一种方法是设置明确的返回值,第二种方法是利用 never 类型.

> 第一种方法是设置明确的返回值

```typescript
// 会报错：函数缺少结束返回语句，返回类型不包括 "undefined"
function area(s: Shape): number {
  switch (s.kind) {
    case 'square':
      return s.size * s.size
      break
    case 'rectangle':
      return s.width * s.height
      break
  }
}
```

> 第二种方法是利用 never 类型,原理是在最后 default 判断分支写一个函数，设置参数是 never 类型，然后把最外面函数的参数传进去，正常情况下是不会执行到 default 分支的。

```typescript
function area(s: Shape) {
  switch (s.kind) {
    case 'square':
      return s.size * s.size
      break
    case 'rectangle':
      return s.width * s.height
      break
    case 'circle':
      return Math.PI * s.r ** 2
      break
    default:
      return ((e: never) => {
        throw new Error(e)
      })(s)
    //这个函数就是用来检查s是否是never类型，如果s是never类型，说明前面的分支全部覆盖了，如果s不是never类型，说明前面的分支有遗漏，就得需要补一下。
  }
}
```

### 联合类型的类型缩减

将 `string` 原始类型和“string 字面量”类型组合成联合类型，效果就是类型缩减成 `string` 原始类型，同样，对于 number、boolean、枚举也是一样的缩减逻辑。

```ts
type URStr = 'abc' | string // 类型是 string
type URNum = 2 | number // 类型是 number
type URBoolen = true | boolean // 类型是 boolean
enum EnumUR {
  ONE,
  TWO,
}
type URE = EnumUR.ONE | EnumUR // 类型是 EnumUR
```

TypeScript 对这样的场景做了缩减，它把字面量类型、枚举成员类型所减掉，只保留原始类型、枚举类型等父类型，这是合理的“优化”

可是这个缩减，会极大地削弱 IDE 自动提示的能力，所以 TypeScript 官方其实还提供了一个黑魔法，它可以让类型缩减被控制，只需要给父类型添加 `& {}` 即可。

```ts
type BorderColor = 'black' | 'red' | 'green' | 'yello' | 'blue' | string // 类型缩减成 string
/**
 * 下面的类型为 "black" | "red" | "green" | "yello" | "blue" | (string & {})，字面量类型全保留了，所以 IDE 提示还会生效
 */
type BorderColor = 'black' | 'red' | 'green' | 'yello' | 'blue' | (string & {}) // 字面量类型全都保留了
```

#### 问题：如何定义一个接口中，某个属性为 number 类型，其他字符串索引返回值的类型为 string 类型？

当联合类型的成员是接口类型，如果满足其中一个接口的属性是另一个接口属性的子集，这个属性也会类型缩减，所以利用这个特性，就可以解决提出来的这个问题。。

例如一个对象：

```js
{
  age: 1, // 数字类型
  anyProperty: 'str' // 其他不确定的属性都是字符串类型
}
```

要定义满足上面对象的类型校验，肯定需要用到两个接口的联合类型及类型缩减，所以这个问题的核心在于找到一个既是 number 类型的子类型，这样 age 的类型缩减之后就是 number 类型；同时也是 string 类型的子类型，这样才能满足属性和 string 索引类型的约束关系。

既是 number 的子类型，也是 string 的子类型，哪个类型满足这个条件呢？答案是 never 类型。never 有一个特性是它是所有类型的子类型，自然也是 number 和 string 的子类型。具体实现代码如下：

```ts
type UnionInterce = { age: number } | { age: never; [key: string]: string }

const O: UnionInterce = {
  age: 2,
  name: 'tom',
}
```

### 联合类型二次处理

#### Exclude

TypeScript 的工具类型，作用是从联合类型中去除指定的类型。

```ts
type Exclude<T, U> = T extends U ? never : T
type ExcludeStr = Exclude<'a' | 'b' | 'c', 'b'> // 类型为 'a' | 'c'
```

#### Extract

跟 Exclude 相反，Extract 主要用来从联合类型中提取指定的类型

```ts
type Extract<T, U> = T extends U ? U : never
type ExtractStr = Extract<'a' | 'b' | 'c', 'b'> // 类型为 'b'
```

#### NonNullable

NonNullable 作用是从联合类型中去除 null 或者 undefined 的类型。

```ts
type NonNullable<T> = T extends null | undefined ? never : T
// 等同于使用 Exclude
type NonNullable<T> = Exclude<T, null | undefined>
type AllType = string | number | null | undefined
type BasicType = NonNullable<AllType> // 类型为 string | number
```

#### Record

Record 作用是使用传入的泛型参数分别作为接口类型的属性和值，生成接口类型

```ts
type Record1<K extends keyof any, T> = {
  [P in K]: T
}
type MenuKey = 'home' | 'about' | 'more'

interface Menu {
  label: string
  hidden?: boolean
}

const menus: Record1<MenuKey, Menu> = {
  about: { label: '关于' },
  home: { label: '主页' },
  more: { label: '更多', hidden: true },
}
```

**需要注意：这里的实现限定了第一个泛型参数继承自 `keyof any`，在 TypeScript 中，`keyof any` 指代可以作为对象键的属性，因为 `keyof any` 生成的类型是 `string | number | symbol`，目前，JavaScript 仅支持 `string`、`number`、`symbol` 的值作为对象的键值。**

## 交叉类型（Intersection Type）

交叉类型可以把多个类型合并成一个类型，合并后的类型将拥有所有成员类型。

很显然，如果仅仅把原始类型、字面量类型、函数类型等原子类型合并成交叉类型，是没有任何用处的，因为任何类型都不能满足同时属于多种原子类型，比如即使 string 类型又是 number 类型。举个例子 `type Useless = string & number` 中 Useless 的类型就是 never。

交叉类型真正的用武之地是将多个接口类型合并成一个类型，从而实现等同接口继承的效果，也就是所谓的合并接口类型。

```typescript
interface DogInterface {
  run(): void
}

interface CatInterface {
  jump(): void
}

// 交叉类型 用 & 符号。虽然叫交叉类型，但是是取的所有类型的并集。
let pet: DogInterface & CatInterface = {
  run() {},
  jump() {},
}
```

**注意：合并的多个接口类型存在同名属性，如果同名属性的类型不兼容，比如同名的 name 属性类型，一个是 number，另一个是 string，合并后，name 属性的类型就是 number 和 string 两个原子类型的交叉类型，即 never；如果同名属性的类型兼容，比如一个是 number，另一个是 number 的子类型、数字字面量类型，合并后 name 属性的类型就是两者中的子类型。**

### 交叉类型用于合并联合类型

交叉类型可以用于合并联合类型，这个交叉类型需要同时满足不同的联合类型限制，也就是提取了所有联合类型的相同类型成员，可以理解为求交集。

既然是求交集，如果多个联合类型中没有相同的类型成员，交叉出来的类型自然就是 never 了。

```ts
type UnionA = 'px' | 'em' | 'rem' | '%'
type UnionB = 'vh' | 'em' | 'rem' | 'pt'
type IntersectionUnion = UnionA & UnionB // 类型为 "em" | "rem"
```

### 联合、交叉类型优先级

联合、交叉类型本身可以直接组合使用，联合操作符 `|` 的优先级低于交叉操作符 `&`，同样，可以使用小括弧 `()` 来调整操作符的优先级。

## 索引类型

### 索引类型的查询操作符

`keyof T` 表示类型 T 的所有公共属性的字面量的联合类型

```typescript
interface Obj {
  a: number
  b: string
}
let key: keyof Obj
// key的类型就是Obj的属性a和b的联合类型：let key: "a" | "b"
```

### 索引访问操作符

`T[K]` 表示对象 T 的属性 K 所代表的类型

```typescript
interface Obj {
  a: number
  b: string
}
let value: Obj['a']
// value的类型就是Obj的属性a的类型： let value: number
```

### 泛型约束

`T extends U` 泛型变量可以继承某个类型获得某些属性

先看如下代码片段存在的问题。

```typescript
let obj = {
  a: 1,
  b: 2,
  c: 3,
}

//如下函数如果访问obj中不存在的属性也是没有报错的。
function getValues(obj: any, keys: string[]) {
  return keys.map((key) => obj[key])
}

console.log(getValues(obj, ['a', 'b']))
console.log(getValues(obj, ['e', 'f']))
// 会显示[undefined, undefined]，但是TS编译器并没有报错。
```

解决如下

```typescript
function getValuest<T, K extends keyof T>(obj: T, keys: K[]): T[K][] {
  return keys.map((key) => obj[key])
}
console.log(getValuest(obj, ['a', 'b']))
// console.log(getValuest(obj, ['e', 'f'])) // 这样就会报错了
```

## 映射类型

可以从一个旧的类型，生成一个新的类型。映射类型属于 TypeScript 提供的工具类型，因为时操作接口的，所以也称为**操作接口类型**。

以下代码用到了 TS 内置的映射类型

```typescript
interface Obj {
  a: string
  b: number
  c: boolean
}

// 以下三种类型称为同态，只会作用于Obj的属性，不会引入新的属性
//把一个接口的所有属性变成只读
type ReadonlyObj = Readonly<Obj>
//把一个接口的所有属性变成可选
type PartialObj = Partial<Obj>
//可以抽取接口的子集
type PickObj = Pick<Obj, 'a' | 'b'>
// 去除指定的子集
type OmitObj = Omit1<Obj, 'a' | 'b'>

// 非同态 会创建新的属性
type RecordObj = Record<'x' | 'y', Obj>
// 创建一个新的类型并引入指定的新的类型为
// {
//     x: Obj;
//     y: Obj;
// }
```

## 条件类型

`T extends U ? X : Y`

```typescript
type TypeName<T> = T extends string
  ? 'string'
  : T extends number
  ? 'number'
  : T extends boolean
  ? 'boolean'
  : T extends undefined
  ? 'undefined'
  : T extends Function
  ? 'function'
  : 'object'

type T1 = TypeName<string> // 得到的类型即： type T1 = "string"
type T2 = TypeName<string[]> // 得到的类型即：type T2 = "object"
```

### 分布式条件类型

`(A | B) extends U ? X : Y` 等价于 `(A extends U ? X : Y) | (B extends U ? X : Y)`

```typescript
// 接上文
type T3 = TypeName<string | string[]> // 得到的类型即：type T3 = "string" | "object"
```

用法一：利用分布式条件类型可以实现 Diff 操作

```typescript
type Diff<T, U> = T extends U ? never : T
type T4 = Diff<'a' | 'b' | 'c', 'a' | 'e'> // 即：type T4 = "b" | "c"
// 拆分一下具体步骤
// Diff<"a","a" | "e"> | Diff<"b","a" | "e"> | Diff<"c", "a" | "e">
// 分布结果如下：never | "b" | "c"
// 最终获得字面量的联合类型 "b" | "c"
```

用法二：在 Diff 的基础上实现过滤掉 null 和 undefined 的值。

```typescript
type NotNull<T> = Diff<T, undefined | null>
type T5 = NotNull<string | number | undefined | null> // 即：type T5 = string | number
```

以上的类型别名在 TS 的类库中都有内置的工具类型

- `Diff => Exclude<T, U>`
- `NotNull => NonNullable<T>`

此外，内置的还有很多类型，比如从类型 T 中抽取出可以赋值给 U 的类型 `Extract<T, U>`

```typescript
type T6 = Extract<'a' | 'b' | 'c', 'a' | 'e'> // 即：type T6 = "a"
```

比如： 用于提取函数类型的返回值类型 `ReturnType<T>`

先写出 `ReturnType<T>` 的实现，`infer` 表示在 extends 条件语句中待推断的类型变量。

```typescript
type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any
```

分析一下上面的代码，首先要求传入 ReturnType 的 T 必须能赋值给一个最宽泛的函数，之后判断 T 能不能赋值给一个可以接受任意参数的返回值待推断为 R 的函数，如果可以，返回待推断返回值 R ，如果不可以，返回 any 。

```typescript
type T7 = ReturnType<() => string> //即：type T7 = string
```

## 增强类型系统

### 声明

在 TypeScript 中安全地使用 JavaScript 的库，关键的步骤就是使用 TypeScript 中的一个 declare 关键字。通过使用 declare 关键字，我们可以声明全局的变量、方法、类、对象。

#### declare 变量

在运行时，前端代码 `<script>` 标签会引入一个全局的库，再导入全局变量。此时，如果想安全地使用全局变量，那么就需要对变量的类型进行声明。

声明变量的语法： `declare (var|let|const) 变量名称:变量类型`

```ts
declare let a: string
declare const b: number
a = 'a'
a = 1 // 报错
b = 2 // 报错，const 声明不能再赋值
```

#### declare 函数

声明函数的语法与声明变量的语法相同，不同的是 declare 关键字后需要跟 function 关键字。

```ts
/* 报错，环境声明的上下文不需要实现
declare function toString(x: number) {
  return String
} */
// 正确的语法
declare function toString(x: number): string
const x = toString(1)
```

**注意：使用 declare 关键字时，我们不需要编写声明的变量、函数、类的具体实现（因为变量、函数、类在其他库中已经实现了），只需要声明其类型即可，否则会报错。**

#### declare 类

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

#### declare 枚举

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

#### declare 模块

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

#### declare 文件

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

#### declare namespace

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

在上面的例子中，因为我们声明了全局导入的 jQuery 变量 $，所以可以直接使用 $ 变量的 version 属性以及 ajax 方法。

#### 声明文件

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

##### 使用声明文件

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

##### 使用 @types

[Definitely Typed](https://github.com/DefinitelyTyped/DefinitelyTyped) 是最流行的高质量 TypeScript 声明文件类库，正是因为有社区维护的这个声明文件类库，大大简化了 JavaScript 项目迁移 TypeScript 的难度。

目前，社区已经记录了 90% 的 JavaScript 库的类型声明，意味着如果我们想使用的库有社区维护的类型声明，那么就可以通过安装类型声明文件直接使用 JavaScript 编写的库了。

具体操作：首先，通过[此链接](https://www.typescriptlang.org/dt/search?search=)搜索你想要导入的库的类型声明，如果有社区维护的声明文件。然后，只需要安装 @types/xxx 就可以在 TypeScript 中直接使用它了。

#### 类型合并

因为 Definitely Typed 是由社区人员维护的，如果原来的第三方库升级，那么 Definitely Typed 所导出的第三方库的类型定义想要升级还需要经过 PR、发布的流程，就会导致无法与原库保持完全同步。针对这个问题，在 TypeScript 中，可以通过类型合并、扩充类型定义的技巧临时解决。

##### 合并接口

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

对于函数成员而言，每个同名的函数声明都会被当做这个函数的重载。**需要注意的是后面声明的接口具有更高的优先级**

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

##### 合并 namespace

合并 namespace 与合并接口类似，命名空间的合并也会合并其导出成员的属性。不同的是，非导出成员仅在原命名空间内可见。

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

##### 类不可合并

定义一个类类型，相当于定义了一个类，有定义了一个类的类型。因此，对于类这个既是值又是类型的特殊对象不能合并。

#### 扩充模块

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

#### 扩充全局

全局模块指的是不需要通过 import 导入即可使用的模块，如全局的 window、document 等。

```ts
declare global {
  interface Array<T extends unknown> {
    getLen(): number
  }
}
Array.prototype.getLen = function() {
  return this.length
}
```

## 推荐阅读
