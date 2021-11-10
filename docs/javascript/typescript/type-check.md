# TypeScript 类型检查和保护

## 类型检查机制

**类型检查机制： TypeScript 编译器在做类型检查时，所秉承的一些原则，以及表现出的一些行为。其作用是辅助开发，提高开发效率**

### 类型推断

**类型推断: 指的是不需要指定变量的类型（函数的返回值类型），TypeScript 可以根据某些规则自动地为其推断出一个类型**

#### 基础类型推断

具有初始化值的变量，有默认值的函数参数、函数返回的类型都可以推断出来。

```typescript
let a = 1 // 推断为 number
let b = [1] // 推断为 number[]
let c = (x = 1) => x + 1 // 推断参数 x 的类型是 number 或者 undefined , 推断整个函数为 (x?: number) => number
```

#### 最佳通用类型推断

当需要从多个类型中推断出一个类型的时候，TypeScript 会尽可能的推断出一个兼容当前所有类型的通用类型

```typescript
let d = [1, null]
// 推断为一个最兼容的类型，所以推断为(number | null)[]
// 当关闭"strictNullChecks"配置项时，null是number的子类型，所以推断为number[]
```

#### 上下文类型推断

以上的推断都是从右向左，即根据表达式推断，上下文类型推断是从左向右，通常会发生在事件处理中。

#### let 和 const 的类型推断区别

const 定义为一个不可变更的常量，在缺省类型注解的情况下，TypeScript 推断出它的类型直接由赋值字面量的类型决定，也是一种比较合理的设计。

```ts
const str = 'this is string' // str 的类型是 'this is string'
const num = 1 // num 的类型是 1
const bool = true // bool 的类型是 true
```

let 定义的是可变更的变量，缺省显式类型注解时，变量的类型推断为赋值字面量类型的父类型，称为"Literal widening"，也就是字面量类型的拓宽。这种设计也是符合编程预期的，以下面的代码为例，意味着我们可以给 str 和 num 任意值，只要类型是 string 和 number 的子集的变量。

```ts
let str = 'any string' // str 的类型是 string
let num = 2 // num 的类型是 number
let bool = false // bool 的类型是 boolean
```

### 类型拓宽和类型缩小

#### Literal Widening

所有通过 let 或 var 定义的变量、函数的形参、对象的非只读属性，如果满足指定了初始值且未显式添加类型注解的条件，那么他们推断出来的类型就是指定的初始值字面量类型拓宽后的类型，这就是字面量类型拓宽。

```ts
const str = 'this is string' // 类型没有拓宽：str 的类型是 'this is string'
let str2 = str // 类型拓宽：str2 的类型是 string
/**注意上下的区别**/
const string: 'this is string' = 'this is string' // 类型没有拓宽：string 的类型是 'this is string'
let string2 = string // 类型没有拓宽：string2 的类型也是 'this is string'
```

#### Type Widening

通过 let、var 定义的变量如果**满足未显式声明类型注解且被直接赋予了 null 或 undefined 值**，会对 null 和 undefined 的类型进行拓宽，推断出这些变量的类型是 any。

**注意，上面没有说函数的形参，形参的类型不会进行拓宽**

```ts
let x = null // 类型拓宽成 any
let y = undefined // 类型拓宽成 any
/** ------分界线------ **/
const z = null // 不拓宽，类型是 null
/** ------分界线------ **/
let fun = (param = null) => param // 形参不拓宽，类型是 null
let z2 = z // 不拓宽，类型为 null
let x2 = x // 不拓宽，类型为 null
let y2 = y // 不拓宽，类型为 undefined
```

最后几行代码中出现的变量、形参的类型还是保持 null 或 undefined，没有拓宽成 any，也是符合预期的，这样可以让我们更谨慎的对待这些变量、形参。

#### Type Narrowing

在 TypeScript 中，我们可以通过某些操作将变量的类型由一个较为宽泛的集合缩小到相对较小、较明确的集合，这就是“Type Narrowing”。

例如可以使用类型守卫将函数参数的类型从 any 缩小到明确的类型。

```ts
let func = (anything: any) => {
  if (typeof anything === 'string') {
    return anything // 此时 anything 的类型是 string
  }
  return null
}
```

### 类型断言

在确定自己比 TS 更准确的知道类型时，可以使用类型断言来绕过 TS 的检查，改造旧代码很有效，但是防止滥用。

可以使用 as 语法做类型断言，也可以使用尖括号 + 类型的格式做类型断言 `<Bar>{}`，这两种方法虽然没有任何区别，但是尖括号格式会与 JSX 产生语法冲突，因此更推荐 as 语法。

```typescript
interface Bar {
  bar: number
}
let foo = {} as Bar
foo.bar = 1

// 但是推荐变量声明时就要指定类型
let foo1: Bar = {
  bar: 1,
}
```

类型断言的操作对象必须满足某些约束关系，否则我们将得到一个 ts(2352) 的错误，即从类型“原类型”到类型“目标类型”的转换是错误的，因为这两种类型不能充分重叠，例如 `1 as string`。不过，any 和 unknown 这两个特殊类型属于万金油，因为它们既可以被断言成任何类型，反过来任何类型也都可以被断言成 any 或者 unknown。如果想强行断言不充分重叠的情况，可以先断言为 any 或 unknown，再断言为其他的。例如 `1 as any as string`

除了可以把特定类型断言成符合约束添加的其他类型外，还可以使用`字面量 + as const”`语法结构进行常量断言。

另外还有一种特殊非空断言，即在值（变量、属性）的后边添加 `!` 断言操作符，它可以用来排除值为 null、undefined 的情况。对于非空断言，应该把它视作和 any 一样危险的选择，所以建议用类型守卫来代替非空断言。

### 类型兼容

**当一个类型 Y 可以被赋值给另一个类型 X 时，我们就可以说类型 X 兼容类型 Y**

`X兼容Y：X（目标类型） = Y（源类型）`

```typescript
let s: string = 'a'
s = null // 把编译配置中的strictNullChecks设置成false，字符类型是兼容null类型的（因为null是字符的子类型）
```

#### 接口兼容

**成员少的兼容成员多的**

```typescript
interface X {
  a: any
  b: any
}
interface Y {
  a: any
  b: any
  c: any
}

let x: X = { a: 1, b: 2 }
let y: Y = { a: 1, b: 2, c: 3 }
// 源类型只要具有目标类型的必要属性，就可以进行赋值。接口之间相互兼容，成员少的兼容成员多的。
x = y
// y = x // 不兼容
```

#### 函数兼容性

```typescript
type Handler = (a: number, b: number) => void
function test(handler: Handler) {
  return handler
}
```

##### 1、参数个数

###### 固定参数

**目标函数的参数个数一定要多于源函数的参数个数**

Handler 目标函数，传入 test 的 **参数函数** 就是源函数

```typescript
let handler1 = (a: number) => {}
test(handler1) // 传入的函数能接收一个参数，且参数是number，是兼容的
let handler2 = (a: number, b: number, c: number) => {}
test(handler2) // 会报错 传入的函数能接收三个参数（参数多了），且参数是number，是不兼容的
```

###### 可选参数和剩余参数

```typescript
let a1 = (p1: number, p2: number) => {}
let b1 = (p1?: number, p2?: number) => {}
let c1 = (...args: number[]) => {}
```

> (1) 固定参数是可以兼容可选参数和剩余参数的

```typescript
a1 = b1 // 兼容
a1 = c1 // 兼容
```

> (2) 可选参数是不兼容固定参数和剩余参数的,但是可以通过设置"strictFunctionTypes": false 来消除报错，实现兼容

```typescript
b1 = a1 //不兼容
b1 = c1 // 不兼容
```

> (3) 剩余参数可以兼容固定参数和可选参数

```typescript
c1 = a1 // 兼容
c1 = b1 // 兼容
```

##### 2、参数类型

###### 基础类型

```typescript
// 接上面的test函数
let handler3 = (a: string) => {}
test(handler3) // 类型不兼容
```

###### 接口类型

接口成员多的兼容成员少的，也**可以理解把接口展开，参数多的兼容参数少的**。对于不兼容的，也可以通过设置"strictFunctionTypes": false 来消除报错，实现兼容

```typescript
interface Point3D {
  x: number
  y: number
  z: number
}
interface Point2D {
  x: number
  y: number
}
let p3d = (point: Point3D) => {}
let p2d = (point: Point2D) => {}

p3d = p2d // 兼容
p2d = p3d // 不兼容
```

##### 3、返回值类型

目标函数的返回值类型必须与源函数的返回值类型相同，或者是其子类型

```typescript
let f = () => ({ name: 'Alice' })
let g = () => ({ name: 'A', location: 'beijing' })
f = g // 兼容
g = f // 不兼容
```

##### 4、函数重载

函数重载列表（目标函数）

```typescript
function overload(a: number, b: number): number
function overload(a: string, b: string): string
```

函数的具体实现（源函数）

```typescript
function overload(a: any, b: any): any {}
```

目标函数的参数要多于源函数的参数才能兼容

```typescript
function overload(a: any, b: any, c: any): any {} // 具体实现时的参数多于重载列表中匹配到的第一个定义的函数的参数，也就是源函数的参数多于目标函数的参数，不兼容
```

返回值类型不兼容

```typescript
function overload(a: any, b: any) {} // 去掉了返回值的any，不兼容
```

#### 枚举类型兼容性

```typescript
enum Fruit {
  Apple,
  Banana,
}
enum Color {
  Red,
  Yello,
}
```

##### 枚举类型和数字类型是完全兼容的

```typescript
let fruit: Fruit.Apple = 4
let no: number = Fruit.Apple
```

##### 枚举类型之间是完全不兼容的

```typescript
let color: Color.Red = Fruit.Apple // 不兼容
```

#### 类的兼容性

和接口比较相似，只比较结构，需要注意，在比较两个类是否兼容时，**静态成员和构造函数是不参与比较的**，如果两个类具有相同的实例成员，那么他们的实例就相互兼容

```typescript
class A {
  constructor(p: number, q: number) {}
  id: number = 1
}
class B {
  static s = 1
  constructor(p: number) {}
  id: number = 2
}
let aa = new A(1, 2)
let bb = new B(1)
// 两个实例完全兼容，静态成员和构造函数是不比较的
aa = bb
bb = aa
```

###### 私有属性

类中存在私有属性情况有两种，如果其中一个类有私有属性，另一个没有。没有的可以兼容有的，如果两个类都有，那两个类都不兼容。

如果一个类中有私有属性，另一个类继承了这个类，那么这两个类就是兼容的。

```typescript
class A {
  constructor(p: number, q: number) {}
  id: number = 1
  private name: string = '' // 只在A类中加这个私有属性，aa不兼容bb，但是bb兼容aa，如果A、B两个类中都加了私有属性，那么都不兼容
}
class B {
  static s = 1
  constructor(p: number) {}
  id: number = 2
}
let aa = new A(1, 2)
let bb = new B(1)
aa = bb // 不兼容
bb = aa // 兼容

// A中有私有属性，C继承A后，aa和cc是相互兼容的
class C extends A {}
let cc = new C(1, 2)
// 两个类的实例是兼容的
aa = cc
cc = aa
```

#### 泛型兼容

##### 泛型接口

泛型接口为空时，泛型指定不同的类型，也是兼容的。

```typescript
interface Empty<T> {}

let obj1: Empty<number> = {}
let obj2: Empty<string> = {}
// 兼容
obj1 = obj2
obj2 = obj1
```

如果泛型接口中有一个接口成员时，类型不同就不兼容了

```typescript
interface Empty<T> {
  value: T
}

let obj1: Empty<number> = {}
let obj2: Empty<string> = {}
// 报错，都不兼容
obj1 = obj2
obj2 = obj1
```

##### 泛型函数

两个泛型函数如果定义相同，没有指定类型参数的话也是相互兼容的

```typescript
let log1 = <T>(x: T): T => {
  return x
}
let log2 = <U>(y: U): U => {
  return y
}
log1 = log2
log2 = log1
```

#### 兼容性总结

- 结构之间兼容：成员少的兼容成员多的
- 函数之间兼容：参数多的兼容参数少的

## 类型保护机制

指的是 TypeScript 能够在特定的区块(`类型保护区块`)中保证变量属于某种特定的类型。可以在此区块中放心地引用此类型的属性，或者调用此类型的方法。

前置代码，之后的代码在此基础运行

```typescript
enum Type {
  Strong,
  Week,
}

class Java {
  helloJava() {
    console.log('hello Java')
  }
  java: any
}

class JavaScript {
  helloJavaScript() {
    console.log('hello JavaScript')
  }
  javaScript: any
}
```

实现 getLanguage 方法直接用 lang.helloJava 是不是存在作为判断是会报错的

```typescript
function getLanguage(type: Type, x: string | number) {
  let lang = type === Type.Strong ? new Java() : new JavaScript()

  // 如果想根据lang实例的类型，直接用lang.helloJava是不是存在来作为判断是会报错的，因为现在lang是Java和JavaScript这两种类型的联合类型
  if (lang.helloJava) {
    lang.helloJava()
  } else {
    lang.helloJavaScript()
  }
  return lang
}
```

> 利用之前的知识可以使用类型断言解决

```typescript
function getLanguage(type: Type, x: string | number) {
  let lang = type === Type.Strong ? new Java() : new JavaScript()

  // 这里就需要用类型断言来告诉TS当前lang实例要是什么类型的
  if ((lang as Java).helloJava) {
    ;(lang as Java).helloJava()
  } else {
    ;(lang as JavaScript).helloJavaScript()
  }
  return lang
}
```

> 类型保护第一种方法，instanceof

```typescript
function getLanguage(type: Type, x: string | number) {
  let lang = type === Type.Strong ? new Java() : new JavaScript()

  // instanceof 可以判断实例是属于哪个类，这样TS就能判断了。
  if (lang instanceof Java) {
    lang.helloJava()
  } else {
    lang.helloJavaScript()
  }
  return lang
}
```

> 类型保护第二种方法， in 可以判断某个属性是不是属于某个对象

```typescript
function getLanguage(type: Type, x: string | number) {
  let lang = type === Type.Strong ? new Java() : new JavaScript()

  //  in 可以判断某个属性是不是属于某个对象 如上helloJava和java都能判断出来
  if ('java' in lang) {
    lang.helloJava()
  } else {
    lang.helloJavaScript()
  }
  return lang
}
```

> 类型保护第三种方法， typeof 类型保护，可以帮助我们判断基本类型

```typescript
function getLanguage(type: Type, x: string | number) {
  let lang = type === Type.Strong ? new Java() : new JavaScript()

  // x也是联合类型，typeof类型保护，可以判断出基本类型。
  if (typeof x === 'string') {
    x.length
  } else {
    x.toFixed(2)
  }
  return lang
}
```

> 类型保护第四种方法，通过创建一个类型保护函数来判断对象的类型

**类型保护函数**的返回值有点不同，用到了 is ，叫做**类型谓词**

```typescript
function isJava(lang: Java | JavaScript): lang is Java {
  return (lang as Java).helloJava !== undefined
}
```

```typescript
function getLanguage(type: Type, x: string | number) {
  let lang = type === Type.Strong ? new Java() : new JavaScript()

  // 通过创建一个类型保护函数来判断对象的类型
  if (isJava(lang)) {
    lang.helloJava()
  } else {
    lang.helloJavaScript()
  }
  return lang
}
```

### 总结

不同的判断方法有不同的使用场景：

- typeof：判断一个变量的类型（多用于基本类型）
- instanceof：判断一个实例是否属于某个类
- in：判断一个属性是否属于某个对象
- 类型保护函数：某些判断可能不是一条语句能够搞定的，需要更多复杂的逻辑，适合封装到一个函数内
