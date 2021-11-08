# TypeScript 高级类型

## 交叉类型

用 `&` 符号。虽然叫交叉类型，但是是取的所有类型的**并集**。

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

## 联合类型

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
  return pet
}
```

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

可以从一个旧的类型，生成一个新的类型

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

以上的类型别名在 TS 的类库中都有内置的类型

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

创建运维管理主文件夹，创建地域管理和主机集合的文件夹和路由访问文件
