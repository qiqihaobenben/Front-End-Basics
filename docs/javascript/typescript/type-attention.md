# TypeScript 类型重点分析

## 字面量类型

在 TypeScript 中，字面量不仅可以表示值，还可以表示类型，即所谓的字面量类型。目前支持 3 种字面量类型：字符串字面量类型、数字字面量类型、布尔字面量类型。

字面量类型是集合类型的子类型，它是集合类型的一种更具体的表达。比如 `'this is string'`（这里表示一个字符串字面量类型）类型是 string 类型（确切地说是 string 类型的子类型），而 string 类型不一定是 `'this is string'` 类型。

实际上，定义单个字面量类型并没有太大的用处，它真正的应用场景是可以把多个字面量类型组合成一个联合类型，用来描述拥有明确成员的实用的集合。

## 数组类型

有两种类型注解方式，特别注意第二种使用 TS 内置的 Array 泛型接口。

```typescript
let arr1: number[] = [1, 2, 3]
// 下面就是使用 TS 内置的 Array 泛型接口来实现的
let arr2: Array<number | string> = [1, 2, 3, 'abc']
```

定义数组类型的方式不管是直接使用 `[]` ，还是使用 Array 泛型，虽然本质上没有任何区别，但是更推荐使用 `[]` 这种形式来定义。**一方面可以避免与 JSX 的语法冲突，另一方面可以减少代码量。**

## 元组类型（Tuple）

元组是一种特殊的数组，限定了数组元素的个数和类型。它特别适合用来实现多值返回。

```typescript
let tuple: [number, string] = [0, '1']
```

TypeScript 的数组和元组转译为 JavaScript 后都是数组。数组类型的值只有显式添加了元组类型注解后（或者使用 as const，声明为只读元组），TypeScript 才会把它当作元组，否则推断出来的类型就是普通的数组类型。**需要注意的是，毕竟 TypeScript 会转译成 JavaScript，所以 TypeScript 的元组无法在运行时约束所谓的“元组”像真正的元组一样，保证元素类型、长度不可变更。并且还需要注意元组的越界问题，虽然可以越界添加元素，但是仍然是不能越界访问，强烈不建议这么使用。**

```typescript
tuple.push(2) // 不报错
console.log(tuple) // [0, "1", 2] 也能都打印出来
console.log(tuple[2]) // 但是想取出元组中的越界元素，就会报错元组长度是 2，在 index 为 2 时没有元素
```

## unknown

unknown 主要用来描述类型不确定的变量。

例如在多个判断条件分支场景下，它可以用来接收不同条件下类型各异的返回值的临时变量，在 3.0 之前的版本中，只有使用 any 才能满足这种动态类型场景。

与 any 不同的是，unknown 在类型上更安全。比如我们可以将任意类型的值赋值给 unknown，但是 unknown 类型的值只能赋值给 unknown 或 any。

使用 unknown 后，TypeScript 会对它做类型检测，所有的类型缩小手段对 unknown 都有效，但是如果不缩小类型（Type Narrowing），我们对 unknown 执行的任何操作都会出现 ts(2571) 错误。

```ts
let result: unknown
result.toFixed() // 报错提示 ts(2571)
```

```ts
let result: unknown
if (typeof result === 'number') {
  result.toFixed() // 不报错
}
```

## 对象类型

对象如果要赋值或者修改属性值，那么就不能用简单的对象类型，需要定义完整的对象类型

```typescript
let obj: object = { x: 1, y: 2 }
obj.x = 3 // 会报错，只是简单的定义了是object类型，但是里面到底有什么属性没有标明

// 需要改成如下的对象类型定义
let obj: { x: number; y: number } = { x: 1, y: 2 }
obj.x = 3
```

## symbol 类型

symbol 类型可以直接声明为 symbol 类型，也可以直接赋值，跟 ES6 一样，两个分别声明的 symbol 是不相等的。

```typescript
let s1: symbol = Symbol()
let s2 = Symbol()
console.log(s1 === s2) // false
```

## void、undefined 、null 类型

void 类型，它仅适用于表示没有返回值的函数，即如果该函数没有返回值，那它的类型就是 void。在 strict 模式下，声明一个 void 类型的变量几乎没有任何实际用处，因为我们不能把 void 类型的变量值再赋值给除了 any 和 unknown 之外的任何类型变量。

变量可以被声明为 undefined 和 null ，但是一旦被声明，就不能再赋值其他类型，所以单纯声明 undefined 或者 null 类型的变量是很鸡肋的。

undefined 的最大价值主要体现在接口类型上，它表示一个可缺省、未定义的属性。

null 的价值可能主要体现在接口制定上，它表明对象或属性可能是空值。

```typescript
let un: undefined = undefined
let nu: null = null
un = 1 // 会报错
nu = 1 // 会报错
```

undefined 和 null 是任何类型的子类型，那就可以赋值给其他类型。但是需要设置配置项 "strictNullChecks": false。并且这里还有个设计是：可以把 undefined 值或类型是 undefined 的变量赋值给 void 类型变量，反过来，类型是 void 但值是 undefined 的变量不能赋值给 undefined 类型。

```typescript
// 设置 "strictNullChecks": false
let num: number = 123
num = undefined
num = null

// 但是更建议将 num 设置为联合类型
let num: number | undefined | null = 123
num = undefined
num = null
```

undefined 和 null 类型还具备警示意义，它们可以提醒我们针对可能操作这两种（类型）值的情况做容错处理。比如我们需要类型守卫（Type Guard）在操作之前判断值的类型是否支持当前操作。类型守卫既能通过类型缩小影响 TypeScript 的类型检测，也能保障 JavaScript 运行时的安全性。

```ts
const userInfo: { id?: number; name?: null | string } = { id: 1, name: 'tom' }
// Type Guard
if (userInfo.id !== undefined) {
  userInfo.id.toFixed() // id 的类型缩小成 number
}
```

不建议随意使用非空断言来排除值可能为 null 或 undefined 的情况，因为这样很不安全。而比非空断言更安全，比类型守卫更方便的做法是使用单问号（Optional Chain）、双问号（空值合并）来保障代码的安全性。

```ts
const userInfo: { id?: number; name?: null | string } = {}

userInfo.id!.toFixed() // 非空断言，静态检查ok，但不建议，可能会报错
userInfo.id?.toFixed() // Optional Chain
const myName = userInfo.name ?? 'jerry' // 空值合并
```

## never 类型

never 表示永远不会发生值的类型，例如抛出错误的函数的返回值类型就是 never，函数代码中时一个死循环，那么这个函数的返回值类型也是 never。

never 是所有类型的子类型，它可以给所有类型赋值，但是反过来，除了 never 自身外，其他类型（包括 any 在内的类型）都不能为 never 类型赋值。

在恒为 false 的类型守卫条件判断下，变量的类型将缩小为 never（never 是所有其他类型的子类型，所以是类型缩小为 never，而不是变成 never）

基于 never 的特征，我们可以使用 never 实现一些有意思的功能，比如可以把 never 作为接口类型下的属性类型，用来禁止写入接口下特定的属性。

```ts
const props: { id: number; name?: never } = { id: 1 }
props.name = 'tom' // 会报错，name 变为只读属性
```

## 枚举类型

枚举分为数字枚举和字符串枚举，此外还有异构枚举（不推荐）

### 数字枚举

枚举既能通过名字取值，又能通过索引取值，我们具体看一下是怎么取到的。

```typescript
enum Role {
  Reporter = 1,
  Developer,
  Maintainer,
  Owner,
  Guest,
}
Role.Reporter = 2 // 枚举成员是只读的，不能修改重新赋值

console.log(Role)
//打印出来：{1: "Reporter", 2: "Developer", 3: "Maintainer", 4: "Owner", 5: "Guest", Reporter: 1, Developer: 2, Maintainer: 3, Owner: 4, Guest: 5}
//我们看到打印出来是一个对象，对象中有索引值作为 key 的，有名字作为 key 的，所以枚举既能通过名字取值，又能通过索引取值

// 看一下 TS 编译器是怎么用反向映射实现枚举的。
'use strict'
var Role
;(function(Role) {
  Role[(Role['Reporter'] = 1)] = 'Reporter'
  Role[(Role['Developer'] = 2)] = 'Developer'
  Role[(Role['Maintainer'] = 3)] = 'Maintainer'
  Role[(Role['Owner'] = 4)] = 'Owner'
  Role[(Role['Guest'] = 5)] = 'Guest'
})(Role || (Role = {}))
```

### 字符串枚举

字符串枚举只能通过名字取值，不能通过索引取值。

```typescript
enum Message {
  Success = '成功',
  Fail = '失败',
}
console.log(Message)
// 打印出来：{Success: "成功", Fail: "失败"}
// 我们看到只有名字作为 key ，说明字符串枚举不能反向映射
```

### 常量枚举

用 const 声明的枚举就是常量枚举，会在编译阶段被移除。如下代码编译后 Month 是不产生代码的，只能在编译前使用，当我们不需要一个对象，但是需要一个对象的值的时候，就可以使用常量枚举，这样可以减少编译后的代码。

```typescript
const enum Month {
  Jan,
  Feb,
  Mar,
}
let month = [Month.Jan, Month.Feb, Month.Mar]
```

### 异构枚举

数字和字符串枚举混用，**不推荐**

```typescript
enum Answer {
  N,
  Y = 'Yes',
  // C, // 在字符串枚举成员后面的枚举成员必须赋一个初始值
  //  X = Math.random() // 含字符串成员的枚举中不允许使用计算值
}
```

### 枚举成员注意点

- 枚举成员是只读的，不能修改重新赋值
- 枚举成员的分为 const member 和 computer member

* 常量成员（const member），包括没有初始值的情况、对已有枚举成员的引用、常量表达式，会在编译的时候计算出结果，以常量的形式出现在运行时环境
* 计算成员（computer member），需要被计算的枚举成员，不会在编译阶段进行计算，会被保留到程序的执行阶段

- 在 computed member 后面的枚举成员，一定要赋一个初始值，否则报错
- 含字符串成员的枚举中不允许使用计算值（computer member），并且在字符串枚举成员后面的枚举成员必须赋一个初始值，否则会报错（见上面的异构类型）
- 数字枚举中，如果有两个成员有同样索引，那么后面索引会覆盖前面的（见下面的枚举 number ）

```typescript
// 枚举成员
enum Char {
  // const member 常量枚举，会在编译阶段计算结果，以常量的形式出现在运行时环境
  a,
  b = Char.a,
  c = 1 + 3,

  // computed member 需要被计算的枚举成员，不会在编译阶段进行计算，会被保留到执行阶段
  d = Math.random(),
  e = '123'.length,
  // 在 computed member 后面的枚举成员，一定要赋一个初始值，否则报错
  f = 1,
}
console.log(Char)

// 枚举 number
enum number {
  a = 1,
  b = 5,
  c = 4,
  d,
}
console.log(number) //打印出{1: "a", 4: "c", 5: "d", a: 1, b: 5, c: 4, d: 5}
// b赋初始值为5，c赋初始值为4，按照索引递增，d的索引就是5，索引相同时，后面的值覆盖前面的，所以5对应的 value 就是d
```

### 枚举和枚举成员作为单独的类型

有以下三种情况，（1）枚举成员都没有初始值、（2）枚举成员都是数字枚举、（3）枚举成员都是字符串枚举

- 变量定义为数字枚举类型，赋值**任意 number 类型**的值都是可以的（可以超出枚举定义的数字范围），对枚举没有影响，但是不能赋值字符串等。
- 不同的枚举类型是不能比较的，不过同一个枚举类型是可以比较的，但是同一个枚举类型的不同枚举成员是不能比较的
- 变量定义为枚举类型，甚至就算定义为枚举类型的某个具体成员的类型，赋值也是对枚举没有影响的。（如下，E 和 F 的结果还是不变的）
- 字符串枚举类型的赋值，只能用枚举成员，不能随意赋值。（如果下 F）

```typescript
enum E {
  a,
  b,
} // 枚举成员都没有初始值
enum F {
  a = 1,
  b = 5,
  c = 4,
  d,
} // 枚举成员都是数字枚举
enum G {
  a = 'apple',
  b = 'banana',
} // 枚举成员都是字符串枚举

// 变量定义为数字枚举类型，赋值任意number类型的值都是可以的，对枚举没有影响，但是不能赋值字符串等。
let e: E = 3
let f: F = 3
// e === f // 不同的枚举类型是不能比较的，会报错
console.log(E, F, e, f) // 打印：{0: "a", 1: "b", a: 0, b: 1}， {1: "a", 4: "c", 5: "d", a: 1, b: 5, c: 4, d: 5}， 3， 3
// 可见变量定义为E，F赋值，对E,F枚举本身没有影响

let e1: E = 3
let e2: E = 3
console.log(e1 === e2) // 同一个枚举类型是可以比较的，结果为true

let e3: E.a = 3
let e4: E.b = 3
// e3 === e4 // 同一个枚举类型的不同枚举成员是不能比较的,会报错
console.log(E, E.a, E.b, e3, e4) // 打印：{0: "a", 1: "b", a: 0, b: 1} 0 1 3 3 ，可见变量定义为E.a，E.b赋值，对E以及E.a,E.b枚举本身没有影响

//字符串枚举类型的赋值，只能用枚举成员，不能随意赋值。
let g1: G = 'abc' // 会报错
let g2: G = G.a // g2能赋值G.a或者G.b
let g3: G.a = G.a // g2 只能赋值G.a
```

## 接口类型

**接口约束对象、函数、类的结构**

### 对象类型接口

TypeScript 对对象的类型检测遵循一种被称之为“鸭子类型”（duck typing）或者“结构化类型”（structural subtyping）的准则，即只要两个对象的结构一致，属性和方法的类型一致，则它们的类型就是一致的。

#### 对象冗余字段

对象类型接口直接验证有冗余字段的**对象字面量**时会报错，这种冗余字段有时是不可避免的存在的。

```typescript
interface List {
  id: number
  name: string
}
interface Result {
  data: List[]
}

function render(result: Result) {
  result.data.forEach((value) => {
    console.log(value.id, value.name)
  })
}

render({
  data: [
    { id: 1, name: 'A', sex: 'male' },
    { id: 2, name: 'B' },
  ],
})
// 这就是对象类型接口直接验证有冗余字段的“对象字面量”，上面render中会有报错，说对象只能指定已知属性，并且"sex"不在类型"List"中
```

> 解决方法一：在外面声明变量 result ,然后把 result 传入 render 函数，避免传入对象字面量。

```typescript
// 把字面量先赋值给一个变量这样就能绕过检测
let result = {
  data: [
    { id: 1, name: 'A', sex: 'male' },
    { id: 2, name: 'B' },
  ],
}
render(result)
```

> 解决方法二： 用类型断言（两种 as 和尖括号），但是如果对象字面中都没有符合的，还是会报错，可以用 as unknown as xxx

```typescript
render({
  data: [
    { id: 1, name: 'A', sex: 'male' },
    { id: 2, name: 'B' },
  ],
} as Result)

// 但是如果传入的对象字面量中没有一项是符合的，那用类型断言还是会报错
render({
  data: [{ id: 1, name: 'A', sex: 'male' }],
} as Result) // 还是会报错属性"data"的类型不兼容

// 现在就需要这么写，用 as unknown as xxx
render(({
  data: [{ id: 1, name: 'A', sex: 'male' }],
} as unknown) as Result)
```

> 解决方法三：用字符串索引签名

```typescript
interface List {
  id: number
  name: string
  [x: string]: any
}
// 这样对象字面量就可以包含任意多个字符串属性了。
```

#### 接口属性可定义为只读属性和可选属性

```typescript
interface List {
  readonly id: number // 只读属性
  name: string
  age?: number // 可选属性
}
```

#### 可索引类型

不确定一个接口中有多少属性时，可以使用可索引类型。分为数字索引签名和字符串索引签名，如果接口定义了某一种索引签名的值的类型，之后再定义的属性的值必须是签名值的类型的子类型。可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型。

```typescript
interface Names {
  [x: string]: number | string
  // y: boolean; // 会报错 boolean 不会赋值给字符串索引类型，因为字符串索引签名的类型是 number | string，所以之后再定义的属性必须是签名值类型的子类型
  [z: number]: number // 字符串索引签名后也能定义数字索引签名，数字索引的返回值必须是字符串索引返回值类型的子类型
}
```

### 函数类型接口

```typescript
interface Add {
  (x: number, y: number): number
}
// 跟变量声明是等价的：let Add: (a: number, b: number) => number
let add4: Add = (a, b) => a + b
```

### 混合接口

混合接口，需要注意看一下，接口中的属性没有顺序之分，混合接口不需要第一个属性是匿名函数。

```typescript
interface Lib {
  version: string
  (): void
  doSomething(): void
}
// 需要用到类型断言
let lib: Lib = (() => {}) as Lib
lib.version = '1.0'
lib.doSomething = () => {}
```

### 接口继承

```typescript
// 以下是接口继承的例子
interface Human {
  name: string
  eat(): void
}
interface Man extends Human {
  run(): void
}
interface Child {
  cry(): void
}

interface Boy extends Man, Child {}
let boy: Boy = {
  name: '',
  run() {},
  eat() {},
  cry() {},
}
```

## 函数类型相关

### 定义 TS 函数的四种方式，第一种方式可以直接调用，但是后三种就需要先实现定义的函数再调用

```typescript
// 第一种，直接声明
function add1(x: number, y: number): number {
  return x + y
}
// 应用时形参和实参一一对应
add1(1, 2)

// 第二种 变量声明（注意是 : ）
let add2: (x: number, y: number) => number
// 应用如下
add2 = (a, b) => a + b
add2(2, 2)

// 第三种 类型别名（注意是 = ）
type Add3 = (x: number, y: number) => number
// 应用如下
let add3: Add3 = (a, b) => a + b
add3(3, 2)

// 第四种 接口实现
interface Add4 {
  (x: number, y: number): number
}
// 跟变量声明是等价的：let Add4: (a: number, b: number) => number
let add4: Add4 = (a, b) => a + b
add4(4, 2)
```

### 可选参数

可选参数必须位于必选参数之后，即可选参数后面不能再有必选参数

```typescript
// y后面不能再有必选参数，所以d会报错
// function add5(x:number, y?:number, d:number) {

// 正确如下
function add5(x: number, y?: number) {
  return y ? y + x : x
}
add5(1)
```

### 参数默认值

带默认值的参数不需要放在必选参数后面，但如果带默认值的参数出现在必选参数前面，必须明确的传入 undefined 值来获得默认值。在所有必选参数后面的带默认值的参数都是可选的，与可选参数一样，在调用函数的时候可以省略。

```typescript
function add6(x: number, y = 0, z: number, q = 1) {
  return x + y + z + q
}
// 第二个参数必须传入undefined占位
add6(1, undefined, 2)
```

### 函数的 this

TypeScript 中启用严格模式，必须显式指定 this 的类型。通过指定 this 的类型，当我们错误使用了 this，TypeScript 就会提示我们。

在 TypeScript 中，声明 this 的类型，只需要在函数的第一个参数中声明 this 指代的对象（即函数被调用的方式）即可。

```ts
function say(this: Window, name: string) {
  console.log(this.name)
}
window['say'] = say
window.say('tom') // 必须要使用 window 调用
const obj = {
  say,
}
obj.say('tom') // 报错，说 this 的上下文是 obj，不能分配给 Window
say('tom') // 直接调用会报错
```

上面的代码，在 window 对象上增加 say 的属性为函数 say，然后调用 `window.say()` 时，this 指向即为 window 对象。但是调用 `obj.say()` 后，此时 TypeScript 检测到 this 的指向不是 window，就会报错。

如果直接调用 say()，this 实际上应该指向全局变量 window，但是因为 TypeScript 无法确定 say 函数被谁调用，所以将 this 的指向默认为 void。

**注意：显式注解函数中的 this 类型，它表面上占据了第一个形参的位置，但并不意味着函数真的多了一个参数，因为 TypeScript 转译为 JavaScript 后，“伪形参”this 会被抹掉，这算是 TypeScript 为数不多的特有语法**

### 函数重载（也叫函数多态）

要求定义一系列的函数声明，在类型最宽泛的版本中实现重载， TS 编译器的函数重载会去查询一个重载的列表，并且从最开始的一个进行匹配，如果匹配成功，就直接执行。所以我们要把大概率匹配的定义写在前面。

函数重载的声明只用于类型检查阶段，在编译后会被删除。

```typescript
function add8(...rest: number[]): number // 函数重载
function add8(...rest: string[]): string // 函数重载
// 函数实现
function add8(...rest: any[]): any {
  let first = rest[0]
  if (typeof first === 'string') {
    return rest.join('')
  }
  if (typeof first === 'number') {
    return rest.reduce((pre, cur) => pre + cur)
  }
}
add8(1, 2, 3) // 6
add8('1', '2', '3') // '123'
```

函数重载（Function Overload） 更精确地描述了参数与返回值类型约束关系。**函数重载列表的各个成员必须是函数实现的子集。**

### 函数返回值

在 TypeScript 中，如果我们显式声明函数的返回值类型为 undefined ，将会得到这么一个错误提醒：TS2355: A function whose declared type is neither 'void' nor 'any' must return a value。

是指如果函数声明的类型不为 `void` 或 `any` 时，必须要有返回值。

函数的返回值是可缺省和可推断的，函数返回值的类型推断结合泛型可以实现特别复杂的类型计算，比如 Redux Model 中 State、Reducer、Effect 类型的关联。

一般情况下，TypeScript 中的函数返回值类型是可以缺省和推断出来的，但是有些还是需要我们显式声明返回值类型，比如 Generator 函数的返回值。Generator 函数返回的是一个 Iterator 迭代器对象，我们可以使用 Generator 的同名接口泛型或者 Iterator 的同名接口泛型表示返回值的类型：

```ts
type AnyType = boolean
type AnyReturnType = string
type AnyNextType = number
// TypeScript 3.6 之前的版本不支持指定 next、return 的类型
function* gen(): Generator<AnyType, AnyReturnType, AnyNextType> {
  const nextValue = yield true // nextValue 类型是 number，yield 后必须是 boolean 类型
  return `${nextValue}` // 必须返回 string 类型
}
```

## 类

### 类属性和方法注意点

- 类属性都是实例属性，不是原型属性，而类方法都是原型方法
- 实例的属性必须具有初始值，或者在构造函数中初始化，除了类型为 any 的。

### 类的继承

派生类的构造函数必须包含“super”调用，并且访问派生类的构造函数中的 this 之前，必须调用“super"

### 类修饰符

1、public: 所有人可见（默认）、公有的属性或方法。

2、private: 仅在类自身中可见、私有的属性或方法

私有属性只能在声明的类中访问，在子类或者生成的实例中都不能访问,但是 private 属性可以在实例的方法中被访问到，因为也相当于在类中访问，但是子类的的实例方法肯定是访问不到的。

可以把类的 constructor 定义为私有类型，那么这个类既不能被实例化也不能被继承

3、protected：仅在类自身及子类中可见、受保护的属性或方法

受保护属性只能在声明的类及其子类中访问,但是 protected 属性可以在实例的方法中被访问到，因为也相当于在类中访问

可以把类的 constructor 定义为受保护类型,那么这个类不能被实例化,但是可以被继承，相当于基类

4、readonly 只读属性

只读属性必须具有初始值，或者在构造函数中初始化,初始化后就不能更改了，并且已经设置过初始值的只读属性，也是可以在构造函数中被重新初始化的。但是在其子类的构造函数中不能被重新初始化。

**注意：如果只读修饰符和可见修饰符同时出现，需要将只读修饰符写在可见修饰符后面，例如 `public readonly name: sring = 'tom'`**

5、 static 静态属性

只能通过类的名称调用，不能在实例和构造函数或者子类中的构造函数和实例中访问，但是静态属性是可以继承的，用子类的类名可以访问。静态方法不依赖实例 this 上下文就可以定义，这也就意味着需要显式注解 this 类型才可以在静态方法中使用 this；非静态方法则不需要显式注解 this 类型，因为 this 的指向默认是类的实例。

**注意：构造函数的参数也可以添加修饰符,这样可以将参数直接定义为类的属性**

```typescript
class Dog {
  constructor(name: string) {
    this.name = name
    this.legs = 4 // 已经有默认值的只读属性是可以被重新初始化的
  }
  public name: string
  run() {}
  private pri() {}
  protected pro() {}
  readonly legs: number = 3
  static food: string = 'bones'
}
let dog = new Dog('jinmao')
// dog.pri() // 私有属性不能在实例中调用
// dog.pro() // 受保护的属性，不能在实例中调用
console.log(Dog.food) // 'bones'

class Husky extends Dog {
  constructor(name: string, public color: string) {
    super(name)
    this.color = color
    // this.legs = 5 // 子类的构造函数中是不能对父类的只读属性重新初始化的
    // this.pri() // 子类不能调用父类的私有属性
    this.pro() // 子类可以调用父类的受保护属性
  }
  protected age: number = 3
  private nickname: string = '二哈'
  info(): string {
    return this.age + this.nickname
  }
  // color: string // 参数用了修饰符，可以直接定义为属性，这里就不需要了
}

let husky = new Husky('husky', 'black')
husky.info() // 如果调用的类的方法中有对类的私有属性和受保护属性的访问，这是不报错的。
console.log(Husky.food) // 'bones' 子类可以调用父类的静态属性
```

**注意：TypeScript 中定义类的私有属性仅仅代表静态类型检测层面的私有。如果强制忽略 TypeScript 类型的检查错误，转译且运行 JavaScript 时依旧可以取到 lastName 属性，这是因为 JavaScript 并不支持真正意义上的私有属性。目前，JavaScript 类支持 private 修饰符的提案已经到 stage3 了。**

### 抽象类

只能被继承，不能被实例化的类。抽象类的作用其实就是对基础逻辑的封装和抽象。

在抽象类中可以添加共有的方法，也可以添加抽象方法，然后由子类具体实现（必须全部实现）

```typescript
abstract class Animal {
  eat() {
    console.log('eat')
  }
  abstract sleep(): void // 抽象方法，在子类中实现
}
// let animal = new Animal() // 会报错，抽象类无法创建实例

class Cat extends Animal {
  constructor(public name: string) {
    super()
  }
  run() {}
  // 必须实现抽象方法
  sleep() {
    console.log('sleep')
  }
}

let cat = new Cat('jiafei')
cat.eat()
```

### 接口类

- 类实现接口时，必须实现接口的全部属性，不过类可以定义自己的属性
- 接口不能约束类的构造函数，只能约束公有成员

```typescript
interface Human {
  // new (name:string):void // 接口不能约束类的构造函数
  name: string
  eat(): void
}

class Asian implements Human {
  constructor(name: string) {
    this.name = name
  }
  name: string
  // private name: string  // 实现接口时用了私有属性会报错
  eat() {}
  sleep() {}
}
```

### 接口继承类

相当于把类的成员抽象出来，只有类的成员结构，但是没有具体实现

**接口抽离类成员时不仅抽离了公有属性，还抽离了私有属性和受保护属性,所以非继承的子类都会报错**

被抽象的类的子类，也可以实现类抽象出来的接口，而且不用实现这个子类的父类已有的属性

```typescript
class Auto {
  state = 1
  // protected state2 = 0 // 下面的C会报错，因为C并不是 Auto 的子类，C只是实现了 Auto 抽象出来的接口
}
interface AutoInterface extends Auto {}
class C implements AutoInterface {
  state = 1
}

// 被抽象的类的子类，也可以实现类抽象出来的接口，而且不用实现父类的已有的属性
class Bus extends Auto implements AutoInterface {
  // 不用设置 state ，Bus 的父类已经有了。
}
```

## 泛型

### 泛型函数

**注意：用泛型定义函数类型时的位置不用，决定是否需要指定参数类型，见下面例子。**

泛型函数例子

```typescript
function log<T>(value: T): T {
  console.log(value)
  return value
}

log<string[]>(['a', 'b'])
log([1, 2]) // 可以不用指定类型，TS会自动推断

// 还可以用类型别名定义泛型函数
//下面的定义不用指定参数类型
type Log = <T>(value: T) => T // 不用指定参数类型，会自己推断
let myLog: Log = log
//下面的定义必须指定参数类型
type Log<T> = (value: T) => T // 如果这样用泛型定义函数类型，必须指定一个参数类型
let myLog: Log<string> = log
```

### 泛型接口

```typescript
function log<T>(value: T): T {
  console.log(value)
  return value
}

// 以下仅约束泛型接口中的一个泛型函数，实现不用指定泛型的参数类型
interface Log {
  <T>(value: T): T
}
let myLog: Log = log

// 以下约束整个泛型接口，实现需要指定泛型的参数类型，或者用带默认类型的泛型
interface Log1<T> {
  (value: T): T
}
let myLog1: Log1<string> = log

interface Log2<T = string> {
  (value: T): T
}
let myLog2: Log2 = log
```

**注意：泛型接口的泛型定义为全局时，实现必须指定一个参数类型,或者用带默认类型的泛型**

### 泛型类

```typescript
class Log3<T> {
  // 静态成员不能引用类的泛型参数
  // static start(value: T) {
  //   console.log(value)
  // }
  run(value: T) {
    console.log(value)
    return value
  }
}
let log3 = new Log3<number>()
log3.run(1)

//不指定类型，就可以传入任何类型
let log4 = new Log3()
log4.run('abc')
```

**注意：泛型不能应用于类的静态成员。并且实例化时，不指定类型，就可以传入任何类型**

### 泛型约束

约束泛型传入的类型

```typescript
interface Length {
  length: number
}
function log5<T extends Length>(value: T) {
  // 想要打印出定义为泛型T的value的length属性，则T必须要有length属性，所以需要泛型约束，T继承length接口后，就肯定具有了length属性
  console.log(value, value.length)
  return value
}
log5([1])
log5('abc')
log5({ length: 1 })
```

### 泛型总结

- 利用泛型，函数和类可以轻松地支持多种类型，增强程序的扩展性
- 不必写多条函数重载，冗长的联合类型声明，增强代码可读性
- 灵活控制类型之间的约束
