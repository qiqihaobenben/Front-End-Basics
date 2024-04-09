# decorator 装饰器

## 前置知识

### 面向切面编程（AOP）

AOP 即面向切面编程（Aspect Oriented Programming）

类似于“洋葱模型”，AOP 主要意图是将日志记录，性能统计，安全控制，异常处理等代码从业务逻辑代码种抽离出来，将它们独立到非核心业务逻辑的方法中，进而达到改变这些功能行为的时候不会影响核心业务逻辑的代码。

简而言之：就是“优雅”的把“辅助功能逻辑”从“核心业务逻辑”中分离、解耦出来。

### 控制反转（IoC）

IoC 即 控制反转（Inversion of Control） 是解耦的一种设计模式。

在传统的程序设计中，我们的代码直接控制所有的流程和对象的创建。而采用 IoC 后，这种控制权被反转了，意味着对象的创建和流程的控制不是由我们的代码直接管理，而是交给外部的容器或框架来处理。

AOP 可以通过 IoC 容器来实现。

### 依赖注入（DI）

DI 即 依赖注入（Dependency Injection），是 IoC 的一种具体实现。

依赖注入允许我们的代码在运行时接收它的依赖项，而不是硬编码它们，从而提高了代码的模块化和可测试性。

### 属性描述符

`Object.defineProperty(obj, props, descriptor)` 的作用是直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。该方法接收三个参数：

- 要定义属性的对象（obj）
- 要定义或修改的属性名或 `Symbol` （props）
- 要定义或修改的属性描述符（descriptor）

#### 属性描述符有两种主要形式

- 数据描述符：是一个具有值的属性（value），该值可以是可写的，也可以是不可写的（writable）
- 存取描述符：由 getter 函数和 setter 函数所描述的属性。

一个属性描述符只能是这两者种的其中一种，不能同时是两者。

#### 共享的属性描述符键值

- `configurable`：属性是否可以被删除或者是否可以再次修改其属性描述符，默认值为 `false`
  - 如果 configurable 设置为 true，则该属性的描述符可以被改变，也可以从所属对象上删除该属性。
  - 如果 configurable 设置为 false，则除了直接修改属性的值和修改其 writable 属性为 false 之外，不能做其他修改。也就是说，一旦属性被设置为不可配置（configurable: false），就不能再将它变回可配置的了。
- `enumerable`：属性是否会出现在对象的枚举属性种，默认值为 `false`

#### 数据描述符特有键值

- `value`：该属性对应的值，默认值为 `undefined`
- `writable`：属性是否可以被修改，默认值是 `false`

#### 存取描述符特有键值

- get：一个给属性提供 getter 的方法。当访问该属性时，会调用此方法，并返回其返回值。默认为 `undefined`
- set：一个给属性提供 setter 的方法。当属性值被修改时，会调用此方法，该方法将接收唯一的参数，即该属性的新值。默认为 `undefined`

## 定义

### 装饰器模式

装饰器模式（Decorator Pattern）是一种抽象的设计模式，核心思想是**在不修改原有代码情况下，对功能进行扩展**

#### 遵循的设计模式原则

1. 单一职责原则
2. 开闭原则

### 装饰器

装饰器（Decorator）是一种特殊的装饰类函数，是一种对装饰器模式理念的具体实现。

它接受一个函数或类作为参数，并返回一个已经被修改或增强功能的函数或类的版本

### 装饰器工厂函数

装饰器工厂函数是返回一个装饰器的函数。这使得装饰器可以接受参数，因此可以在不同的场景下提供更多的灵活性。装饰器工厂函数先执行，其返回值（一个装饰器函数）随后应用于目标函数或类。

### 装饰器语法

`@decorator` 装饰器语法是一种便捷的语法糖，通过 `@` 来引用，需要编译后才能进行。

## 装饰器用法

装饰器语法`@decorator`，不过目前还处于第 2 阶段提案中，使用它之前需要使用 TypeScript 或 Babel 模块编译成 ES5 或 ES6。

### 类装饰器

#### 语法

```
// 类装饰器
function classDecorator(target) {
  return // ...
};
```

- 参数：接受一个参数
  - target：类的构造器
- 返回值：如果类装饰器返回了一个值，她将会被用来代替原有的类构造器的声明

#### 适用场景

- 给当前类添加一些属性和方法
- 继承当前类，并进行扩展

#### 举例

可以添加一个 addToJsonString 方法给所有的类来新增一个 toString 方法

```
function addToJsonString(target) {
  return class extends target {
    toJsonString() {
      return JSON.stringify(this)
    }
  }
}

@addToJsonString
class Demo {
  one = 1
  two = 2
}

console.log(new Demo().toJsonString()) // {"one":1,"two":2}
```

### 方法装饰器

#### 语法

```
// 方法装饰器
function methodDecorator(target, propertyKey, descriptor) {
  return // ...
};
```

- 参数
  - target: 对于静态成员来说是类的构造器，对于实例成员来说是类的原型链
  - propertyKey: 属性的名称
  - descriptor: 属性的描述器
- 返回值：如果返回了值，它会被用于替代属性的描述器。

#### 使用场景

方法装饰器可以实现与 **Before / After** 钩子 相关的场景功能。

#### 举例

```
function logTime(target, key, descriptor) {
  const oldMethed = descriptor.value
  const logTime = function (...arg) {
    let start = +new Date()
    try {
      return oldMethed.apply(this, arg) // 调用之前的函数
    } finally {
      let end = +new Date()
      console.log(`耗时: ${end - start}ms`)
    }
  }
  descriptor.value = logTime
  return descriptor
}

class Demo {
  @logTime
  run() {
    console.log('start')
  }
}

console.log(new Demo().run())
// start
// 耗时: 14ms
```

### 属性装饰器

#### 语法

语法跟方法装饰器类似，只不过不要随意修改 decorator 的 value，因为属性装饰器会在代码运行前生效，所以修改了 value 可能不会生效。

#### 使用场景

修改属性的描述符

#### 举例

```
function readonly(target, name, descriptor) {
  descriptor.writable = false
  return descriptor
}

class Person {
  @readonly
  name = 'zhangsan'
}

const person = new Person()
console.log(person.name, Object.getOwnPropertyDescriptor(person, 'name'))
// zhangsan {value: 'zhangsan',writable: false,enumerable: true,configurable: true}
```

### 访问器装饰器

#### 语法

语法跟方法装饰器类似，唯一的区别在于第三个参数 descriptor 描述器中有的 key 不同：

方法装饰器的描述符的 key 为：

- value
- writable
- enumerable
- configurable

访问器装饰器的描述符的 key 为：

- get
- set
- enumerable
- configurable

#### 使用场景

可以在某个属性赋值的时候做加一层代理

#### 举例

```
// 装饰器工厂函数
function addExtraNumber(num) {
  // 返回的函数才是真正的装饰器
  return function (target, propertyKey, descriptor) {
    const original = descriptor.set

    descriptor.set = function (value) {
      const number = value + num
      return original.call(this, number)
    }
  }
}

class Demo {
  x = 1
  @addExtraNumber(2)
  set number(num) {
    this.x = num
  }
  get number() {
    return this.x
  }
}
const test = new Demo()
test.number = 10
console.log(test.number) // 12

```

### 参数装饰器（TypeScript 实现）

#### 语法

```
// 参数装饰器
function parameterDecorator(target, methedKey, parameterIndex) {

}
```

- 参数：接收三个参数

  - target: 对于静态成员来说是类的构造器，对于实例成员来说是类的原型链
  - methedKey: 方法的名称，注意！是方法的名称，而不是参数的名称
  - parameterIndex: 参数在方法中所处的位置的下标

- 返回：返回的值将会被忽略

#### 使用场景

单独的参数装饰器能做的事情很有限，它一般都被用于记录可被其它装饰器使用的信息。

#### 举例（需要 TypeScript 编译）

```
function Log(target, methedKey, parameterIndex) {
  console.log(`方法名称 ${methedKey}`);
  console.log(`参数顺序 ${parameterIndex}`);
}

class GuanYu {
  attack(@Log person, @Log dog) {
    console.log(`向 ${person} 挥了一次大刀`)
  }
}

// [LOG]: "方法名称 attack"
// [LOG]: "参数顺序 0"
```

## 装饰器的实现原理

```
class Demo {
  run() {
    console.log('start')
  }
}
```

给 run 方法增加耗时计算

### 硬编码

```js
class Demo {
  run() {
    const start = +new Date()
    console.log('start')
    const end = +new Date()
    console.log(`耗时: ${end - start}ms`)
  }
}
```

硬编码存在的问题：

- 理解成本高：统计耗时的相关代码与函数本身逻辑并无关系，对函数结构造成了破坏性的修改，影响到了对原函数本身的理解
- 维护成本高：如果后期还有更多类似的函数需要添加统计耗时的代码，在每个函数中都添加这样的代码非常低效，也大大提高了维护成本

### 手动实现装饰器模式

#### 核心思路

- Step1 备份原来类构造器 (Class.prototype) 的属性描述符 (Descriptor)
  - 利用 Object.getOwnPropertyDescriptor 获取
- Step2 编写装饰器函数逻辑代码
  - 利用执行原函数前后钩子，添加耗时统计逻辑
- Step3 用装饰器函数覆盖原来属性描述符的 value
  - 利用 Object.defineProperty 代理
- Step4 手动执行装饰器函数，装饰 Class(类) 指定属性
  - 从而实现在不修改原代码的前提下，执行额外逻辑代码

#### 代码实现

```js
function decoratorLogTime(target, key) {
  // Step1 备份原来类原型对象上的属性描述符 Descriptor
  const oldDescriptor = Object.getOwnPropertyDescriptor(target, key)
  const oldFun = oldDescriptor.value
  // Step2 编写装饰器函数逻辑代码
  const logTime = function(...arg) {
    // Before 钩子
    const start = +new Date()
    try {
      oldFun.apply(this, arg) // 调用原函数
    } finally {
      // After 钩子
      let end = +new Date()
      console.log(`耗时: ${end - start}ms`)
    }
  }
  // Step3 将装饰器覆盖原来的属性描述符的 value
  Object.defineProperty(target, key, {
    ...oldDescriptor,
    value: logTime,
  })
}

class Demo {
  run() {
    console.log('start')
  }
}
// Step4 手动执行装饰器函数，装饰 Demo 的 run 函数
decoratorLogTime(Demo.prototype, 'run')
```

#### 手动实现的装饰器需要优化

1. 是否可以让装饰器更加关注业务逻辑？Step 1 和 Step3 是通用逻辑，每个装饰器都需要实现，可以抽离复用
2. 是否可以让装饰器写法更简单？纯函数实现的装饰器，每装饰一个属性都要手动执行装饰器函数，详见 Step4 步骤。

针对上述优化点，装饰器草案中提出了装饰器语法糖，也就是 @Decorator ，只需要在想使用的装饰器前加上@符号，装饰器就会被应用到目标上。

### 装饰器语法糖

```js
// Step2 编写装饰器函数业务逻辑代码
function logTime(target, key, descriptor) {
  const oldMethed = descriptor.value
  const logTime = function(...arg) {
    let start = +new Date()
    try {
      return oldMethed.apply(this, arg) // 调用之前的函数
    } finally {
      let end = +new Date()
      console.log(`耗时: ${end - start}ms`)
    }
  }
  descriptor.value = logTime
  return descriptor
}

class Demo {
  // Step4 利用 @ 语法糖装饰指定属性
  @logTime
  run() {
    console.log('start')
  }
}
```

## 装饰器的执行顺序

### 同种装饰器组合顺序：洋葱模型

如果同一个方法有多个装饰器，其执行顺序是怎样的？

答案：以方法装饰器为例，同种装饰器组合后，其顺序会像剥洋葱一样，先从外到内进入，然后由内向外执行。和 Koa 的中间件顺序类似。

```js
function dec(id) {
  console.log('装饰器初始化', id)
  return function(target, property, descriptor) {
    console.log('装饰器执行', id)
  }
}

class Example {
  @dec(1)
  @dec(2)
  method() {}
}

// 装饰器初始化 1
// 装饰器初始化 2
// 装饰器执行 2
// 装饰器执行 1
```

### 不同类型装饰器顺序

1. 参数装饰器先执行，按照其被应用到的方法参数从最后一个到第一个依次执行。
2. 方法装饰器和属性装饰器接着执行，按照它们声明的顺序从上到下执行。
3. 类装饰器最后执行，如果有多个类装饰器，它们的执行顺序是从下到上（即与声明顺序相反）。

值得注意的是，装饰器工厂函数的调用顺序和装饰器的执行顺序是不同的。工厂函数是在代码解析阶段就被调用的，而装饰器本身的执行是在所有工厂函数调用之后，按照上述规则进行的。

## 装饰器的优缺点

### 优点

- 在不修改原有代码情况下，对功能进行扩展。也就是对扩展开放，对修改关闭。
- 优雅地把“辅助性功能逻辑”从“业务逻辑”中分离，解耦出来。（AOP 面向切面编程的设计理念）
- 装饰类和被装饰类可以独立发展，不会相互耦合
- 装饰模式是 Class 继承的一个替代模式，可以理解成组合

### 缺点

但是糖再好吃，也不要吃太多，容易坏牙齿的，滥用过多装饰器会导致很多问题：

- 理解成本：过多带业务功能的装饰器会使代码本身逻辑变得扑朔迷离
- 调试成本：装饰器层次增多，会增加调试成本，很难追溯到一个 Bug 是在哪一层包装导致的

### 注意事项

#### 装饰器的功能逻辑代码一定是辅助性的

比如日志记录，性能统计等，这样才符合 AOP 面向切面编程的思想，如果把过多的业务逻辑写在了装饰器上，效果会适得其反。

##### 装饰器语法尚未定案以及未被纳入 ES 标准，标准化的过程还需要很长时间

## 阅读

- [Decorator 装饰器](https://mp.weixin.qq.com/s/DexxNuRG-x29dZrWCcJDuQ)
- [前端装饰器模式快闪](https://mp.weixin.qq.com/s/Lph9HRay6bJU_KzOjsW6Mg)
- [一文读懂 @Decorator 装饰器](https://mp.weixin.qq.com/s/jzLO37bKYwLlPlVXTnzPfQ)
