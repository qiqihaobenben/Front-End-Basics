# TypeScript 类型编程

## 一、实现一个 subType 函数，参数只接受对象的子对象

```ts
type T = {
  name: string
  age: number
}

function subType<K extends keyof T>(args: Pick<T, K>) {}

subType({ name: 'tom' })
subType({ name: 'tom', age: 10 })
subType({ name: 'tom', age: 10, gender: 'male' }) // 报错 对象文字可以只指定已知属性，并且“gender”不在类型“Pick<T, keyof T>”中
```

实现思路：

1. 因为 `keyof T = 'name' | 'age'`， `U` 是 `keyof T` 的子类型，可能为 `'name' | 'age' | ('name' | 'age')`
2. 所以 `Pick<T, U>` 类型为 `{ name: string } | { age: number} | { name: string, age: number}`

## 二、下划线字符串转驼峰式

实现一个泛型 `Underscore`，对于给定的下划线形式的字符串类型 `T`，返回驼峰形式的类型 `G`

```ts
type Underscore<T extends string> = T extends `${infer L}_${infer R}` ? `${L}${Underscore<Capitalize<R>>}` : T

type Result = Underscore<'hello_world_with_types'> // Result 的类型为 'helloWorldWithTypes'
```

实现思路：模板字符串类型 + 递归类型

## 三、链式调用

```ts
declare const a: Chainable // 完善 Chainable 类型
const result = a.option('foo', 123).option('bar', { value: 'Hello World' }).option('name', 'type-challenges').get()

// result
type res = typeof result
// 期望res的类型和Expected相似
type Expected = {
  foo: number
  bar: {
    value: string
  }
  name: string
}
```

因为 option 方法始终返回对象本身

```ts
type Chainable<T = {}> = {
  option<K extends string, V>(key: K, value: V): Chainable<{ [Key in keyof T | K]: Key extends keyof T ? T[Key] : V }>
  get(): T
}
```

## 四、对 Readonly 工具类型进行扩展

TypeScript 提供了 `Readonly` 工具类型，可以把泛型 T 的所有属性设为 `readonly`：

```ts
type Readonly<T> = { readonly [key in keyof T]: T[key] }
```

### 1、实现一个通用的 `PartialReadonly<T, K>`

它有两个类型参数 `T` 和 `K`，`K` 指定应设置为 `T` 的属性集。如果为提供 `K`，则应使所有属性都变为只读，就像普通的 `Readonly<T>` 一样。

```ts
type PartialReadonly<T, K extends keyof T = keyof T> = { readonly [key in K]: T[key] } & { [key in Exclude<keyof T, K>]: T[key] }
```

### 2、实现一个通用的 `DeepReadonly<T>`

它将泛型 `T` 的每个属性机器子类型递归设置为只读。

```ts
type DeepReadonly<T> = T extends Record<string, any> ? { readonly [key in keyof T]: DeepReadonly<T[key]> } : T
```

## 五、扩展 keyof 实现一个通用的 `DeepKeyOf<T>`

泛型 T 是一个任意的 interface，输出是它的各级 key 连接以后的一个 union。

例如：

```ts
interface X {
  x: {
    a: number
    b: string
  }
  y: string
}

// 期望得到：
```

实现：

```ts
type DeepKeyOf<T> = T extends Record<string, unknown>
  ? {
      [key in keyof T]: key extends string ? key | `${key & string}.${DeepKeyOf<T[key]>}` : never
    }[keyof T]
  : never
```

### 涉及 never 类型的一些特性

1. never 类型是所有类型的子类型，所以 union 类型中，never 会被忽略。

```ts
type A = string | number | never // 类型 A 为 string | number
```

2. 如果模板字符串的输入中出现了 never，会导致整个字符串变成 never

```ts
type A = 'name' | 'age' // 类型 A 为 string | number
type B = never
type key = `get${A}` // key 为 "getname" | "getage"
type key1 = `get${B}` // key1 为 never
```

## 六、运用类型编程实现数字累加

例如：

```ts
type Result = Sum<3> // 期望 Result 的类型为 6，即1 + 2 + 3 = 6
```

列一下涉及的知识点：

1. 数组类型可以使用 length 属性，例如 `type L = [1,2,3]["length"]` 此时类型 L 为 `3`
2. 数组类型可以使用展开运算符，例如 `type A = [...[1], ...[2]]` 此时类型 A 为元组 `[1,2]`
3. TypeScript v4.1 新增递归条件类型

拆解一下数字累加

### 1. 实现计数功能

利用递归构造一个循环往空数组里添加单个类型，直到数组的长度跟计数的数字相等，返回构造完成的元组

泛型参数详解：

- N：number，计数值
- T：需要补充进元组的类型
- R：递归循环计数完成后的元组结果

```ts
type Count<N extends number, T = any, R extends any[] = []> = R['length'] extends N ? R : Count<N, T, [...R, T]>

type Example1 = Count<3> // Example1 的类型为元组 [any, any, any]
type Example2 = Count<5, number> // Example2 的类型为元组 [number, number, number, number, number]
```

### 2. 在可以计数的基础上实现两个数字的加法相加

```ts
type Add<A extends number, B extends number> = [...Count<A>, ...Count<B>]['length']

type Example1 = Add<2, 3> // Example1 类型为 5
type Example2 = Add<5, 3> // Example1 类型为 8
```

### 3. 在两个数字相加的基础上实现数字累加

泛型参数详解：

- I： 表示索引 index 的计数元组
- R： 表示每次循环中间结果 result 的计数元组

```ts
type Sum<N extends number, I extends any[] = [], R extends any[] = []> = I['length'] extends N ? Add<R['length'], N> : Sum<N, [...I, 0], [...R, ...I]>

type Result = Sum<3> // Result 类型为 6，即1 + 2 + 3 = 6
type Result1 = Sum<10> // Result 类型为 55
```

### 做加法运算的时候怎么保证只接收正整数

```ts
type NonNegativeInteger<T extends number> = number extends T ? never : `${T}` extends `-${string}` | `${string}.${string}` ? never : T

const number1: NonNegativeInteger<6> = 6 // success
const number2: NonNegativeInteger<-1> = -1 // error -1 不能分配给 never

// 如果 A 或 B 有一个不符合正整数的类型要求，Add 的类型就是 never
type Add<A extends number, B extends number> = NonNegativeInteger<A> extends never ? never : NonNegativeInteger<B> extends never ? never : [...Count<A>, ...Count<B>]['length']
```

## 七、斐波那契数列

泛型参数详解：

- P：pre，是前一个数值的计数元组
- C：current，是当前数值的计数元组
- I：index，迭代循环索引

```ts
// 0 1 1 2 3 5 8 13 21 34 55 89 144
type fibnacci<T extends number, P extends any[] = [], C extends any[] = [0], I extends any[] = [0]> = T extends 0
  ? 0
  : I['length'] extends T
  ? C['length']
  : fibnacci<T, C, [...P, ...C], [...I, 0]>

type A = fibnacci<6> // A 的类型为 8
type B = fibnacci<12> // B 的类型为 144
```

## 八、二进制数组转化成十进制整数

例如一个二进制数 1100，转换成十进制后是 12

泛型参数详解：

- B: binary，即二进制数组，例如二进制数是 1100，B 就为 [0, 0, 1, 1]
- I: index, 递归循环的索引，如果 I 数组的长度跟 B 数组的长度一致，代表循环结束
- V： value，当前数组索引的计数，例如第 0 位是 2^0 为 [0], 2^2 为 [0,0,0,0]
- R: result, 最后结果计数

```ts
type FromBinary<B extends (0 | 1)[], I extends any[] = [], V extends any[] = [0], R extends any[] = []> = I['length'] extends B['length']
  ? R['length']
  : FromBinary<B, [...I, 0], [...V, ...V], B[I['length']] extends 0 ? R : [...R, ...V]>

type result = FromBinary<[0, 0, 1, 1]> // result 的类型为 12
```

## 九、操作函数的参数和返回值类型

实现一个泛型`ChangeArgument<F extends (...args: any) => any>`，对于给定的函数类型`F`，返回一个新的函数 `G`。`G`的参数类型为 `F` 参数类型减去第一项 `First`，`G` 的返回类型为 `F` 的返回类型在末尾加上类型为 `First` 的值。

例如：

```ts
type Fn = (a: number, b: string) => [number]
type Result = ChangeArgument<Fn>
// 期望Result是 (a: number) => [number, string]
type Fn1 = () => [number]
type Result1 = ChangeArgument<Fn>
// 期望Result1是 () => [number]
```

### 1、获取函数参数类型第一项 `First` 的类型

```ts
type FirstArgument<F extends (...args: any[]) => any[]> = Parameters<F>['length'] extends 0 ? never : Parameters<F>[0]
```

### 2、获取函数参数类型第一项除外的剩余参数类型

```ts
type RestArgument<F extends (...args: any[]) => any[]> = F extends (first: any, ...rest: infer R) => any ? R : never
```

### 3、实现函数参数和返回值类型的变换

```ts
type ChangeArgument<F extends (...args: any[]) => any[]> = Parameters<F>['length'] extends 0 ? F : (...args: RestArgument<F>) => [...ReturnType<F>, FirstArgument<F>]
```

如果传入泛型的函数类型没有参数值，直接返回。

## 十、把联合类型转化成元组

### 1. 实现把联合类型转化成交叉类型

在 TS 严格模式下，函数的参数是协变的，利用这个特性可以实现把联合类型转化成交叉类型。

```ts
type UnionToIntersection<T> = (T extends any ? (args: T) => any : never) extends (args: infer R) => any ? R : never
```

详解：以 `UnionToIntersection<'a' | 'b>` 为例

1. `T extends any` 利用了 extends 的 distribute 特性。因为任何类型都 extends any，所以第一步就会转化为：

```ts
((args: 'a') => any | (args: 'b') => any) extends (args: infer R) => any ? R : never
```

2. 如果在 extends 中使用 infer。对于给定的 infer 类型变量 V，如果有候选类型是从协变的位置上推断出来的，那么 V 的类型是那些候选类型的联合类型。反之，如果有候选类型是从逆变的位置上推断出来的，那么 V 的类型是那些候选类型的交叉类型。否则 V 的类型是 never。[官方文档](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#conditional-types)

```ts
// 继续转化
((args: 'a') => any extends (args: infer R) => any ? R : never) | ((args: 'b') => any extends (args: infer R) => any ? R : never)

// R 是从一个逆变位置 inferred，即最后结果 'a' 和 'b' 交叉类型
'a' & 'b'
```

### 2. 利用多个函数的交叉类型是函数重载获取联合类型的最后一项

```ts
type LastInUnion<T> = UnionToIntersection<T extends any ? (args: T) => any : never> extends (args: infer R) => any ? R : never
```

#### LastInUnion 是如何获取联合类型的最后一项的？

以 `LastInUnion<'a' | 'b'>` 为例：

先看第一部分，`UnionToIntersection<T extends any ? (args: T) => any : never>` 转化后

```ts
((args: (args: 'a') => any) => any | (args: (args: 'b') => any) => any) extends (args: infer R) => any ? R : never
// 联合类型转化成了交叉类型
(args: 'a') => any & (args: 'b') => any
```

**在 TS 中，多个函数类型的交叉类型被理解为函数重载，获取重载类型的返回类型会获得最后一项的类型**

所以，第二部分转化为

```ts
((args: 'a') => any & (args: 'b') => any) extends (args: infer R) => any ? R : never

// 即
(args: 'b') => any extends (args: infer R) => any ? R : never
```

得到联合类型 `'a' | 'b'` 的最后一项为 `'b'`

### 3. 基于 `LastInUnion` 实现把联合类型转化为元组

```ts
type UnionToTuple<T> = [T] extends [never] ? [] : [...UnionToTuple<Exclude<T, LastInUnion<T>>>, LastInUnion<T>]
```

上面的类型写法要注意为什么是 `[T] extends [never]` 而不是 `T extends never`？[点击查看详解](https://github.com/type-challenges/type-challenges/issues/614)

## 一些类型编程练习

- [TypeScript 类型体操姿势合集](https://github.com/type-challenges/type-challenges/blob/main/README.zh-CN.md)
- [解读 type-challenges Medium 难度 17~24 题](https://mp.weixin.qq.com/s/SJerRC2U5--5kcEZuuZ_uw)
- [解读 type-challenges Medium 难度 25~32 题](https://mp.weixin.qq.com/s/11B6kLuz9TxykGU6_Hh8ug)
-[解读 type-challenges Medium 难度 33~40 题](https://mp.weixin.qq.com/s/eV6V92Q2olfFXiPXZY4vbw)
- [TypeScript 边学边练](https://juejin.cn/post/6989063604016250893)
- [实现 DeepKeyOf](https://mp.weixin.qq.com/s/6K2DXQ9XxyDbWLe7zw67ag)
