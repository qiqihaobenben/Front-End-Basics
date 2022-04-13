# TypeScript 高级类型

## void、undefined 、null 类型

void 类型，它仅适用于表示没有返回值的函数，即如果该函数没有返回值，那它的类型就是 void。

在 strict 模式下，声明一个 void 类型的变量几乎没有任何实际用处，因为我们**不能把 void 类型的变量值再赋值给除了 any 和 unknown 之外的任何类型变量**。

变量可以被声明为 undefined 和 null ，但是一旦被声明，就不能再赋值其他类型，所以**单纯**声明 undefined 或者 null 类型的变量是很鸡肋的。

undefined 的最大价值主要体现在接口类型上，它表示一个可缺省、未定义的属性。

null 的价值也可能主要体现在接口类型上，它表明对象或属性可能是空值。

```typescript
let un: undefined = undefined
let nu: null = null
un = 1
nu = 1
```

undefined 和 null 是大部分类型的子类型，那就可以赋值给其他类型。但是需要设置配置项 "strictNullChecks": false。并且这里还有个设计是：**可以把 undefined 值或类型是 undefined 的变量赋值给 void 类型变量，反过来，类型是 void 但值是 undefined 的变量不能赋值给 undefined 类型。**

```typescript
// 配置项 "strictNullChecks": false
let num: number = 123
num = undefined
num = null
// 相当于
let num: number | undefined | null = 123
num = undefined
num = null
```

undefined 和 null 类型还具备警示意义，它们可以提醒我们针对可能操作这两种（类型）值的情况做容错处理。比如我们需要类型守卫（Type Guard）在操作之前判断值的类型是否支持当前操作。类型守卫既能通过类型缩小影响 TypeScript 的类型检测，也能保障 JavaScript 运行时的安全性。

```ts
const userInfo: { id?: number; name?: null | string } = { id: 1, name: 'tom' }
if (userInfo.id !== undefined) {
  userInfo.id.toFixed() // id 的类型缩小成 number
}
```

不建议随意使用非空断言来排除值可能为 null 或 undefined 的情况，因为这样很不安全。而比非空断言更安全，比类型守卫更方便的做法是使用单问号点（Optional Chain）、双问号（空值合并）来保障代码的安全性。

```ts
const userInfo: { id?: number; name?: null | string } = {}

userInfo.id!.toFixed() // 不建议
userInfo.id?.toFixed()
const myName = userInfo.name ?? 'jerry'
```

**严格模式下，null 和 undefined 表现出与 void 类似的兼容性，不能赋值给除 any 和 unknown 之外的其他类型，反过来，除了 any 和 never 之外，其他类型都不可以赋值给 null 或 undefined。（实际验证发现此处有些区别，可以把 undefined 值或类型是 undefined 的变量赋值给 void 类型变量）**

## any、never、unknown 类型

### any

any 类型可以赋值给除了 never 之外的任意其他类型，反过来其他类型也可以赋值给 any。也就是说：any 可以兼容除 never 以外所有的类型，同时也可以被所有的类型兼容（即 any 既是 bottom type(除 never 外)，也是 top type），再次强调 Any is 魔鬼，一定要慎用、少用

### unknown

unknown 主要用来描述类型不确定的变量。

例如在多个判断条件分支场景下，它可以用来接收不同条件下类型各异的返回值的临时变量，在 3.0 之前的版本中，只有使用 any 才能满足这种动态类型场景。

与 any 不同的是，unknown 在类型上更安全。比如我们可以将任意类型的值赋值给 unknown，但是 unknown 类型的值只能赋值给 unknown 或 any。

不能把 unknown 赋值给除了 any 和它自身之外任何其他类型，反过来其他类型都可以赋值给 unknown（即 unknown 是 top type）

使用 unknown 后，TypeScript 会对它做类型检测，所有的类型缩小手段对 unknown 都有效，但是如果不缩小类型（Type Narrowing），我们对 unknown 执行的任何操作都会出现 ts(2571) 错误。

```ts
let result: unknown
result.toFixed()
```

```ts
let result: unknown
if (typeof result === 'number') {
  result.toFixed() // 不报错
}
```

### never 类型

never 表示永远不会发生值的类型，例如抛出错误的函数的返回值类型就是 never，函数代码中是一个死循环，那么这个函数的返回值类型也是 never。

**never 是所有类型的子类型**，它可以赋值给所有类型，但是反过来，除了 never 自身外，其他类型（包括 any 在内的类型）都不能赋值给 never 类型。（即 never 是 bottom type）

在恒为 false 的类型守卫条件判断下，变量的类型将缩小为 never（never 是所有其他类型的子类型，所以是类型缩小为 never，而不是变成 never）

基于 never 的特征，我们可以使用 never 实现一些有意思的功能，比如可以把 never 作为接口类型下的属性类型，用来禁止写入接口下特定的属性。

```ts
const props: { id: number; name?: never } = { id: 1 }
props.name = 'tom' // 报错

let n: never = (() => {
  throw Error('never')
})()
// 执行不到
let a: number = n
let c: {} = n
```

### 推荐阅读

- [TypeScript 中的 never 类型](https://juejin.cn/post/7034133130433232903)

## 汇总以上特殊类型的特征

| 名称      | 可赋值给              | 可接受赋值               |
| --------- | --------------------- | ------------------------ |
| void      | void,any,unknown      | void,any,never,undefined |
| undefined | undefined,any,unknown | undefined,any,never      |
| null      | null,any,unknown      | null,any,never           |
| any       | 除 never 外的其他类型 | 任何类型                 |
| unknown   | unknown,any           | 任何类型                 |
| never     | 任何类型              | never                    |

## 联合类型（Unions）

联合类型用来表示变量、参数的类型不是单一原子类型，而可能是多种不同的类型的组合。

声明的类型并不确定，可以为多个类型中的一个,除了可以是 TS 中规定的类型外，还有字符串字面量联合类型、数字字面量联合类型

```typescript
let a: number | string = 1

let b: 'a' | 'b' | 'c' = 'a'

let c: 1 | 2 | 3 = 1
```

### 对象联合类型

对象的联合类型，只能取两者共有的属性，所以说对象联合类型只能访问所有类型的交集

```typescript
interface DogInterface {
  run(): void
}

interface CatInterface {
  jump(): void
}

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
  let pet = master === Master.Boy ? new Dog() : new Cat()
  pet.eat()
  // 报错
  // if(typeof pet.run === 'function') {
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
```

如果想要得到正确的报错提醒，第一种方法是设置明确的返回值,第二种方法是利用 never 类型.

> 第一种方法是设置明确的返回值

```typescript
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
type URStr = 'abc' | string
type URNum = 2 | number
type URBoolen = true | boolean
enum EnumUR {
  ONE,
  TWO,
}
type URE = EnumUR.ONE | EnumUR
```

TypeScript 对这样的场景做了缩减，它把字面量类型、枚举成员类型缩减掉，只保留原始类型、枚举类型等父类型，这是合理的“优化”。

类型缩减发生在父子类型之间，never 是所有类型的子类型，所以任何类型与 never 类型沟通的联合类型，never 都会被缩减掉。

可是这个缩减，会极大地削弱 IDE 自动提示的能力，所以 TypeScript 官方其实还提供了一个黑魔法，它可以让类型缩减被控制，只需要给父类型添加 `& {}` 即可。

```ts
type BorderColor = 'black' | 'red' | 'green' | 'yello' | 'blue' | string
type BorderColor = 'black' | 'red' | 'green' | 'yello' | 'blue' | (string & {})
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

### 联合类型二次处理（用到了分布式条件类型的概念）

#### Exclude

TypeScript 的工具类型，作用是从联合类型中去除指定的类型。

```ts
type Exclude<T, U> = T extends U ? never : T
type ExcludeStr = Exclude<'a' | 'b' | 'c', 'b'>
```

#### Extract

跟 Exclude 相反，Extract 主要用来从联合类型中提取指定的类型

```ts
type Extract<T, U> = T extends U ? U : never
type ExtractStr = Extract<'a' | 'b' | 'c', 'b'>
```

#### NonNullable

NonNullable 作用是从联合类型中去除 null 或者 undefined 的类型。

```ts
// 第一种方式
type NonNullable<T> = T extends null | undefined ? never : T
// 第二种方式
type NonNullable<T> = Exclude<T, null | undefined>
type AllType = string | number | null | undefined
type BasicType = NonNullable<AllType>
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

交叉类型可以把多个类型合并成一个类型。

很显然，如果仅仅把原始类型、字面量类型、函数类型等原子类型合并成交叉类型，是没有任何用处的，因为任何类型都不能满足同时属于多种原子类型，比如既是 string 类型又是 number 类型。举个例子 `type Useless = string & number` 中 Useless 的类型就是 never。

交叉类型真正的用武之地是将多个接口类型合并成一个类型，从而实现等同接口继承的效果，也就是所谓的合并接口类型。

```typescript
interface DogInterface {
  run(): void
}

interface CatInterface {
  jump(): void
}

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
type IntersectionUnion = UnionA & UnionB
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
```

### 索引访问操作符

`T[K]` 表示对象 T 的属性 K 所代表的类型

```typescript
interface Obj {
  a: number
  b: string
}
let value: Obj['a']
```

### 泛型约束

`T extends U` 泛型变量可以继承某个类型获得某些属性

先看如下代码片段存在的问题，第二个输出的结果是 `[undefined, undefined]`

```typescript
let obj = {
  a: 1,
  b: 2,
  c: 3,
}

function getValues(obj: any, keys: string[]) {
  return keys.map((key) => obj[key])
}

console.log(getValues(obj, ['a', 'b']))
console.log(getValues(obj, ['e', 'f']))
```

解决如下

```typescript
function getValuest<T, K extends keyof T>(obj: T, keys: K[]): T[K][] {
  return keys.map((key) => obj[key])
}
console.log(getValuest(obj, ['a', 'b']))
```

## 映射类型

在定义类型时，可以组合使用 in 和 keyof，并基于已有的类型创建一个新类型，使得新类型与已有类型保持一致的只读、可选特定，这样的**泛型**称之为映射类型。

可以从一个旧的类型，生成一个新的类型。TypeScript 提供的工具类型很多属于映射类型，因为是操作接口的，所以也称为**操作接口类型**。

以下代码用到了 TS 内置的映射类型

```typescript
interface Obj {
  a: string
  b: number
  c: boolean
}

type ReadonlyObj = Readonly<Obj>
type PartialObj = Partial<Obj>
type PickObj = Pick<Obj, 'a' | 'b'>
type OmitObj = Omit<Obj, 'a' | 'b'>

type RecordObj = Record<'x' | 'y', Obj>
```

**注意：映射类型使用索引签名语法（即属性用 [] 括起来）和 in 关键字限定对象属性的范围，特别注意，只能在类型别名定义中使用 in 和 keyof，如果在接口中使用，则会提示一个 ts(1169) 的错误**

#### 使用 as 重新映射 key

从 TypeScript 4.1 起，可以在映射类型的索引签名中使用类型断言。

```ts
type sourceInterface = {
  id: number
  name?: string
}
type TargetGenericTypeAssertiony<S> = {
  [K in keyof S as `get${Capitalize<string & K>}`]: S[K]
}
type TargetGenericTypeAssertionyInstance = TargetGenericTypeAssertiony<sourceInterface>
/* TargetGenericTypeAssertionyInstance 结果如下
{
    getId: number;
    getName?: string | undefined;
}
*/
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

type T1 = TypeName<string>
type T2 = TypeName<string[]>
```

### 分布式条件类型

分布式条件类型，也称为分配条件类型（Distributive Conditional Types），指的是：在条件类型中，如果泛型入参是联合类型，则会被拆解成为一个个独立的（原子）类型（成员），然后再进行类型运算。

`(A | B) extends U ? X : Y` 等价于 `(A extends U ? X : Y) | (B extends U ? X : Y)`

```typescript
type T3 = TypeName<string | string[]>
```

**注意：在非泛型条件中，联合类型会被当作一个整体对待，可以解除类型分配，另外通过某些手段强制类型入参被当成一个整体，也可以解除类型分配，例如使用 `[]`**

```ts
type StringOrNumberArray<T, U> = [T] extends [U] ? T[] : T
type result = StringOrNumberArray<string | boolean, string | number>
```

**还要注意，never 条件类型判断，存在一定“陷阱”，第一，是因为 never 类型是所有类型的子类型，在 extends 判断语句中，始终是真值；第二，是因为 never 是不能分配的底层类型，包含条件类型的泛型接收 never 作为泛型入参时，如果作为入参以原子形式出现在条件判断 extends 关键字左侧，则实例化得到的类型也是 never。**

```ts
// GetNumber 类型为 number[]
type GetNumber = never extends number ? number[] : never extends string ? string[] : never

type getNever<T> = T extends {} ? T : T[]
type getNever1<T> = T extends {} ? T[] : T

// 包含条件类型的泛型接收 never 作为泛型入参时，如果作为入参以原子形式出现在条件判断 extends 关键字左侧，不管如何，都只会得到 never
// result 类型为 never
type result = getNever<never>
// result1 类型为 never
type result1 = getNever1<never>
```

用法一：利用分布式条件类型可以实现 Diff 操作

```typescript
type Diff<T, U> = T extends U ? never : T
type T4 = Diff<'a' | 'b' | 'c', 'a' | 'e'>
// 以下两个都不能 Diff
type NotDiff = str1 extends str2 ? never : str1
type NotDiff1<T, U> = [T] extends [U] ? never : T
```

用法二：在 Diff 的基础上实现过滤掉 null 和 undefined 的值。

```typescript
type NotNull<T> = Diff<T, undefined | null>
type T5 = NotNull<string | number | undefined | null>
```

以上的类型别名在 TS 的类库中都有内置的工具类型

- `Diff => Exclude<T, U>`
- `NotNull => NonNullable<T>`

此外，内置的还有很多工具类型，比如从类型 T 中抽取出可以赋值给 U 的类型 `Extract<T, U>`

```typescript
type T6 = Extract<'a' | 'b' | 'c', 'a' | 'e'>
```

比如： 用于提取函数类型的返回值类型 `ReturnType<T>`

先写出 `ReturnType<T>` 的实现，类型推断操作符 `infer` 表示在 extends 条件语句中待推断的类型变量。

```typescript
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any
```

分析一下上面的代码，首先要求传入 ReturnType 的 T 必须能赋值给一个最宽泛的函数，之后判断 T 能不能赋值给一个可以接受任意参数的返回值待推断为 R 的函数，如果可以，返回待推断返回值 R ，如果不可以，返回 any 。

```typescript
type T7 = ReturnType<() => string>
```

## 推荐阅读

- [TypeScript 的另一面：类型编程](https://juejin.cn/post/7000360236372459527)
- [TS 在项目中的 N 个实用小技巧 - 第一部分](https://mp.weixin.qq.com/s/4WnHk4t_mYnkUMd9_epzbQ)
- [如何更容易上手 TypeScript 类型编程？](https://mp.weixin.qq.com/s/X3FXN1KYOlxNk3Fw_oYI2Q)
- [never 和 unknown 的优雅之道](https://mp.weixin.qq.com/s/rZ96wy8xUrx4T1qG5OKS0w)
