# TypeScript 基础精粹

## 类型注意事项

### 数组类型

有两种类型注解方式，特别注意第二种使用 TS 内置的 Array 泛型接口。

```typescript
let arr1: number[] = [1, 2, 3]
// 下面就是使用 TS 内置的 Array 泛型接口来实现的
let arr2: Array<number | string> = [1, 2, 3, 'abc']
```

定义数组类型的方式不管是直接使用 `[]` ，还是使用 Array 泛型，虽然本质上没有任何区别，但是更推荐使用 `[]` 这种形式来定义。**一方面可以避免与 JSX 的语法冲突，另一方面可以减少不少代码量。**

### 元组类型（Tuple）

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

### unknown

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

### 函数类型

函数类型可以先定义再使用，具体实现时就可以不用注明参数和返回值类型了,而且**参数名称**也不用必须跟定义时相同。

```typescript
let compute: (x: number, y: number) => number
compute = (a, b) => a + b
```

### 对象类型

对象如果要赋值或者修改属性值，那么就不能用简单的对象类型，需要定义完整的对象类型

```typescript
let obj: object = { x: 1, y: 2 }
obj.x = 3 // 会报错，只是简单的定义了是object类型，但是里面到底有什么属性没有标明

// 需要改成如下的对象类型定义
let obj: { x: number; y: number } = { x: 1, y: 2 }
obj.x = 3
```

### symbol 类型

symbol 类型可以直接声明为 symbol 类型，也可以直接赋值，跟 ES6 一样，两个分别声明的 symbol 是不相等的。

```typescript
let s1: symbol = Symbol()
let s2 = Symbol()
console.log(s1 === s2) // false
```

### void、undefined 、null 类型

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

### never 类型

never 表示永远不会发生值的类型，例如抛出错误的函数的返回值类型就是 never，函数代码中时一个死循环，那么这个函数的返回值类型也是 never。

never 是所有类型的子类型，它可以给所有类型赋值，但是反过来，除了 never 自身外，其他类型（包括 any 在内的类型）都不能为 never 类型赋值。

在恒为 false 的类型守卫条件判断下，变量的类型将缩小为 never（never 是所有其他类型的子类型，所以是类型缩小为 never，而不是变成 never）

基于 never 的特征，我们可以使用 never 实现一些有意思的功能，比如可以把 never 作为接口类型下的属性类型，用来禁止写入接口下特定的属性。

```ts
const props: { id: number; name?: never } = { id: 1 }
props.name = 'tom' // 会报错，name 变为只读属性
```

### 枚举类型

枚举分为数字枚举和字符串枚举，此外还有异构枚举（不推荐）

#### 数字枚举

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

#### 字符串枚举

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

#### 常量枚举

用 const 声明的枚举就是常量枚举，会在编译阶段被移除。如下代码编译后 Month 是不产生代码的，只能在编译前使用，当我们不需要一个对象，但是需要一个对象的值的时候，就可以使用常量枚举，这样可以减少编译后的代码。

```typescript
const enum Month {
  Jan,
  Feb,
  Mar,
}
let month = [Month.Jan, Month.Feb, Month.Mar]
```

#### 异构枚举

数字和字符串枚举混用，**不推荐**

```typescript
enum Answer {
  N,
  Y = 'Yes',
  // C, // 在字符串枚举成员后面的枚举成员必须赋一个初始值
  //  X = Math.random() // 含字符串成员的枚举中不允许使用计算值
}
```

#### 枚举成员注意点

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

#### 枚举和枚举成员作为单独的类型

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

### 接口类型

**接口约束对象、函数、类的结构**

#### 对象类型接口

##### 对象冗余字段

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

##### 接口属性可定义为只读属性和可选属性

```typescript
interface List {
  readonly id: number // 只读属性
  name: string
  age?: number // 可选属性
}
```

##### 可索引类型

不确定一个接口中有多少属性时，可以使用可索引类型。分为数字索引签名和字符串索引签名，如果接口定义了某一种索引签名的值的类型，之后再定义的属性的值必须是签名值的类型的子类型。可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型。

```typescript
interface Names {
  [x: string]: number | string
  // y: boolean; // 会报错 boolean 不会赋值给字符串索引类型，因为字符串索引签名的类型是 number | string，所以之后再定义的属性必须是签名值类型的子类型
  [z: number]: number // 字符串索引签名后也能定义数字索引签名，数字索引的返回值必须是字符串索引返回值类型的子类型
}
```

#### 函数类型接口

```typescript
interface Add {
  (x: number, y: number): number
}
// 跟变量声明是等价的：let Add: (a: number, b: number) => number
let add4: Add = (a, b) => a + b
```

#### 混合接口

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

#### 接口继承

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

### 函数类型相关

#### 定义 TS 函数的四种方式，第一种方式可以直接调用，但是后三种就需要先实现定义的函数再调用

```typescript
// 第一种，直接声明
function add1(x: number, y: number): number {
  return x + y
}
// 应用时形参和实参一一对应
add1(1, 2)

// 第二种 变量声明
let add2: (x: number, y: number) => number
// 应用如下
add2 = (a, b) => a + b
add2(2, 2)

// 第三种 类型别名
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

#### 可选参数

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

#### 参数默认值

带默认值的参数不需要放在必选参数后面，但如果带默认值的参数出现在必选参数前面，必须明确的传入 undefined 值来获得默认值。在所有必选参数后面的带默认值的参数都是可选的，与可选参数一样，在调用函数的时候可以省略。

```typescript
function add6(x: number, y = 0, z: number, q = 1) {
  return x + y + z + q
}
// 第二个参数必须传入undefined占位
add6(1, undefined, 2)
```

#### 函数重载

要求定义一系列的函数声明，在类型最宽泛的版本中实现重载， TS 编译器的函数重载会去查询一个重载的列表，并且从最开始的一个进行匹配，如果匹配成功，就直接执行。所以我们要把大概率匹配的定义写在前面。

函数重载的声明只用于类型检查阶段，在编译后会被删除。

```typescript
function add8(...rest: number[]): number
function add8(...rest: string[]): string
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

### 类

#### 类属性和方法注意点

- 类属性都是实例属性，不是原型属性，而类方法都是原型方法
- 实例的属性必须具有初始值，或者在构造函数中初始化，除了类型为 any 的。

#### 类的继承

派生类的构造函数必须包含“super”调用，并且访问派生类的构造函数中的 this 之前，必须调用“super"

#### 类修饰符

1、public: 所有人可见（默认）。

2、 private: 私有属性

私有属性只能在声明的类中访问，在子类或者生成的实例中都不能访问,但是 private 属性可以在实例的方法中被访问到，因为也相当于在类中访问，但是子类的的实例方法肯定是访问不到的。

可以把类的 constructor 定义为私有类型，那么这个类既不能被实例化也不能被继承

3、 protected 受保护属性

受保护属性只能在声明的类及其子类中访问,但是 protected 属性可以在实例的方法中被访问到，因为也相当于在类中访问

可以把类的 constructor 定义为受保护类型,那么这个类不能被实例化,但是可以被继承，相当于基类

4、 readonly 只读属性

只读属性必须具有初始值，或者在构造函数中初始化,初始化后就不能更改了，并且已经设置过初始值的只读属性，也是可以在构造函数中被重新初始化的。但是在其子类的构造函数中不能被重新初始化。

5、 static 静态属性

只能通过类的名称调用，不能在实例和构造函数或者子类中的构造函数和实例中访问，但是静态属性是可以继承的，用子类的类名可以访问

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

#### 抽象类

只能被继承，不能被实例化的类。

在抽象类中可以添加共有的方法，也可以添加抽象方法，然后由子类具体实现

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

#### 接口类

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

#### 接口继承类

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

### 泛型

#### 泛型函数

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

#### 泛型接口

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

#### 泛型类

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

#### 泛型约束

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

#### 泛型总结

- 利用泛型，函数和类可以轻松地支持多种类型，增强程序的扩展性
- 不必写多条函数重载，冗长的联合类型声明，增强代码可读性
- 灵活控制类型之间的约束

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

## 高级类型

### 交叉类型

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

### 联合类型

声明的类型并不确定，可以为多个类型中的一个,除了可以是 TS 中规定的类型外，还有字符串字面量联合类型、数字字面量联合类型

```typescript
let a: number | string = 1

// 字符串字面量联合类型
let b: 'a' | 'b' | 'c' = 'a'

// 数字字面量联合类型
let c: 1 | 2 | 3 = 1
```

#### 对象联合类型

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

#### 可区分的联合类型

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

### 索引类型

#### 索引类型的查询操作符

`keyof T` 表示类型 T 的所有公共属性的字面量的联合类型

```typescript
interface Obj {
  a: number
  b: string
}
let key: keyof Obj
// key的类型就是Obj的属性a和b的联合类型：let key: "a" | "b"
```

#### 索引访问操作符

`T[K]` 表示对象 T 的属性 K 所代表的类型

```typescript
interface Obj {
  a: number
  b: string
}
let value: Obj['a']
// value的类型就是Obj的属性a的类型： let value: number
```

#### 泛型约束

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

### 映射类型

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

### 条件类型

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

#### 分布式条件类型

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
