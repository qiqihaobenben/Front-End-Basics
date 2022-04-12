# TypeScript 基本语法

## 名词解释

### 类型注解

作用：相当于强类型语言中的类型声明

语法：`(变量/函数): type`，这种语法也叫做**类型后置语法**

```ts
let str: string = 'abc'
```

### 联合类型

联合类型（Union Types）表示取值可以为多种类型中的一种。

```ts
let count: number | string = 10
```

### 枚举

一组有名字的常量集合，可以类比手机里的通讯录。

### 泛型

不预先确定的数据类型，具体的类型在使用的时候才能确定。即**类型参数化**，泛型变量可以类比函数参数，是代表类型的参数。

## 语法

### ES6 的数据类型

- Boolean
- Number
- String
- undefined
- null
- Symbol
- BigInt
- Object

### TS 的数据类型

- boolean
- number
- bigint (target 低于 ES2020 时不可用)
- string
- undefined
- null
- symbol
- array
- function
- object
- **void**
- **any**
- **unknown**
- **never**
- **元组**
- **枚举**
- **高级类型**

### 常规类型注解

```ts
/*******原始值*******/
const isDone: boolean = false
// 可以使用 number 类型表示 JavaScript 已经支持或者即将支持的十进制整数、浮点数，以及二进制数、八进制数、十六进制数
const amount: number = 6
const integer: number = Number(2)
const binary: number = 0b1010 // 二进制整数
const octal: number = 0o27 // 八进制整数
const hex: number = 0xff // 十六进制整数
const big: bigint = 100n // 大整数，需要 target es2020 及以上
// 所有 JavaScript 支持的定义字符串的方法，我们都可以直接在 TypeScript 中使用
const letter: string = String('S') // 显示类型转换
const address: string = 'beijing' // 字符串字面量
const greeting: string = `Hello World` // 模板字符串
const sym: symbol = Symbol(1)

/*******数组*******/
const list: string[] = ['x', 'y', 'z']
const numList: Array<number> = [1, 2, 3] // 使用 Array 泛型定义数组类型

/*******元组*******/
const name: [string, string] = ['Sean', 'Sun']

/*******枚举*******/
enum Color {
  Red,
  Green,
  Blue,
}
const c: Color = Color.Green

// any 任意类型
let anyTypes: any = 4
anyTypes = 'any'
anyTypes = false

// 空值
function doSomething(): void {
  return undefined
}

// 类型断言
let someValue: any = 'this is a string'
let strLength: number = (someValue as string).length
```

#### 注意：

1. 虽然 `number` 和 `bigint` 都表示数字，但是这两个类型不兼容。
2. TypeScript 还包含 Number、String、Boolean、Symbol 等类型（注意这些都是首字母大写的），千万别将它们和小写格式对应的 number、string、boolean、symbol 进行等价。基本上我们不会使用到 Number、String、Boolean、Symbol 类型，因为它们并没有什么特殊的用途。这就像我们一般不用 JavaScript 的 Number、String、Boolean 等构造函数 new 一个相应的实例一样。
3. TS 报错的状态码 2322 是比较常见的，这是静态类型检查的错误码，在注解的类型和赋值的类型不同时会抛出这个错误。
4. 除了 never 类型，可以把 any 类型的值赋值给任意类型的变量。

### Interface

#### TypeScript 中的 Interface 可以看做是一个集合，这个集合是对对象、类等内部结构的约定

```ts
// 定义接口 Coords
// 该接口包含 number 类型的 x，string 类型的 y
// 其中 y 是可选类型，即是否包含该属性无所谓
interface Coords {
  x: number
  y?: string
}

// 定义函数 where
// 该函数接受一个 Coords 类型的参数 l
function where(l: Coords) {
  // doSomething
}

const a = { x: 100 }
const b = { x: 100, z: 'abc' }
// a 拥有 number 类型的 x，可以传递给 where
where(a)
// b 拥有 number 类型的 x 和 string 类型的 y1，可以传递给 where
where(b)

// 下面这种调用方式将会报错，虽然它和 where(b) 看起来是一致的
// 区别在于这里传递的是一个对象字面量
// 对象字面量会被特殊对待并经过额外的属性检查（是不是新鲜？）
// 如果对象字面量中存在目标类型中未声明的属性，则抛出错误
where({ x: 100, z: 'abc' })

// 最好的解决方式是为接口添加索引签名
// 添加如下所示的索引签名后，对象字面量可以有任意数量的属性
// 只要属性不是 x 和 y，其他属性可以是 any 类型
interface Coords {
  x: number
  y?: string
  [propName: string]: any
}
```

#### 接口还常用于约束函数的行为

```ts
// CheckType 包含一个调用签名
// 该调用签名声明了 getType 函数需要接收一个 any 类型的参数，并最终返回一个 string 类型的结果
interface CheckType {
  (data: any): string
}
const getType: CheckType = (data: any): string => {
  return Object.prototype.toString.call(data)
}
getType('abc')
// => '[object String]'
```

#### Interface 也可以用于约束类的行为

```ts
interface ClockConstructor {
  new (hour: number, minute: number): ClockInterface
}
interface ClockInterface {
  tick()
}
function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
  return new ctor(hour, minute)
}
class DigitalClock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log('beep beep')
  }
}
class AnalogClock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log('tick tock')
  }
}
let digital = createClock(DigitalClock, 12, 17)
let analog = createClock(AnalogClock, 7, 32)
```

#### 除了 ES6 增加的 Class 用法，TypeScript 还增加了 C++、Java 中常见的 public / protected / private 限定符，限定变量或函数的使用范围。

**TypeScript 使用的是结构性类型系统，只要两种类型的成员类型相同，则认为这两种类型是兼容和一致的，但比较包含 private 和 protected 成员的类型时，只有他们是来自同一处的统一类型成员时才会被认为是兼容的**

```ts
class Animal {
  private name: string
  constructor(theName: string) {
    this.name = theName
  }
}
class Rhino extends Animal {
  constructor() {
    super('Rhino')
  }
}
class Employee {
  private name: string
  constructor(theName: string) {
    this.name = theName
  }
}

let animal = new Animal('Goat')
let rhino = new Rhino()
let employee = new Employee('Bob')

animal = rhino
// Error: Animal and Employee are not compatible
animal = employee
```

### 函数类型

函数类型可以先定义再使用，具体实现时就可以不用注明参数和返回值类型了,而且**参数名称**也不用必须跟定义时相同。

```typescript
let compute: (x: number, y: number) => number
compute = (a, b) => a + b
```

#### 类型谓词

在 TypeScript 中，函数支持一种特殊的类型描述。就是在添加返回值类型的地方，通过 “参数名 + is + 类型”的格式明确了参数的类型，进而引起类型缩小，所以类型谓词函数的一个重要的应用场景是实现自定义类型守卫。

```ts
function isString(s: any): s is string {
  return typeof s === 'string'
}
function isNumber(n: any) {
  return typeof n === 'number'
}
function operator(x: unknown) {
  if (isString(x)) {
    x.toUpperCase() // x 的类型缩小为 string，可以使用 toUpperCase 方法
  }
  if (isNumber(x)) {
    console.log(x) // x 的类型还是 unknown
    x.toFixed() // 报错，
  }
}
```
