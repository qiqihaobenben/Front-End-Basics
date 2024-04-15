# Proxy

## Proxy 介绍

### 什么是 Proxy？

Proxy 用于创建一个对象的代理，从而实现**基本操作的拦截并自定义行为**（如属性查找、赋值、枚举、函数调用等）。

Proxy 可以理解为在目标对象之前架设一层“拦截”，外界对该对象的访问都必须先通过这层拦截，因此提供了一种机制可以对外界的访问进行过滤和改写等操作。

Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种**元编程**（meta programming），即对编程语言进行编程。

### Proxy 的语法

```js
let proxy = new Proxy(target, handler)
```

- `target`：要使用 Proxy 包装的**目标对象**（可以是任何类型的对象，包括原生对象、数组、函数、甚至另一个代理）。注意：**target 必须是一个对象，不能是原始类型的值**。
- `handler`：一个对象，用来定制拦截行为，其属性全部为函数类型。这些函数类型的属性被称为捕获器、拦截器或陷阱函数（trap），其作用就是基本操作的拦截并自定义行为（如属性查找、赋值等）。注意：**这里的拦截其实是对代理对象（proxy）的基本操作的拦截，而不是对被代理的对象（target）的拦截**

#### handler 对象总共有 13 个捕获器（trap）：

- `get(target, propKey, receiver)`：拦截对象属性的读取，比如`proxy.foo`和`proxy['foo']`。
- `set(target, propKey, value, receiver)`：拦截对象属性的设置，比如`proxy.foo = v`或`proxy['foo'] = v`，返回一个布尔值。
- `has(target, propKey)`：拦截`propKey in proxy`的操作，返回一个布尔值。
- `deleteProperty(target, propKey)`：拦截`delete proxy[propKey]`的操作，返回一个布尔值。
- `ownKeys(target)`：拦截`Object.getOwnPropertyNames(proxy)`、`Object.getOwnPropertySymbols(proxy)`、`Object.keys(proxy)`、`for...in`循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而`Object.keys()`的返回结果仅包括目标对象自身的可遍历属性。
- `getOwnPropertyDescriptor(target, propKey)`：拦截`Object.getOwnPropertyDescriptor(proxy, propKey)`，返回属性的描述对象。
- `defineProperty(target, propKey, propDesc)`：拦截`Object.defineProperty(proxy, propKey, propDesc`）、`Object.defineProperties(proxy, propDescs)`，返回一个布尔值。
- `preventExtensions(target)`：拦截`Object.preventExtensions(proxy)`，返回一个布尔值。
- `getPrototypeOf(target)`：拦截`Object.getPrototypeOf(proxy)`，返回一个对象。
- `isExtensible(target)`：拦截`Object.isExtensible(proxy)`，返回一个布尔值。
- `setPrototypeOf(target, proto)`：拦截`Object.setPrototypeOf(proxy, proto)`，返回一个布尔值。

如果目标对象是函数，那么还有两种额外操作可以拦截。

- `apply(target, ctx, args)`：拦截 Proxy 实例作为函数调用的操作，比如`proxy(...args)`、`proxy.call(ctx, ...args)`、`proxy.apply(...)`。
- `construct(target, args)`：拦截 Proxy 实例作为构造函数调用的操作，比如`new proxy(...args)`。

#### 注意：

- 上面的每个捕获器都是可选的。如果没有设置某个捕获器，那么对应的操作会直接落在目标对象上。
- Proxy 只能对对象的基本操作进行代理，无法代理复合操作

```js
const obj = {
  foo: 'bar',
  fn() {
    console.log('fn调用了')
  },
}
const handler = {
  get(target, key) {
    console.log(`我被读取了${key}属性`)
    return target[key]
  },
  apply(target, thisArg, argumentsList) {
    console.log('fn调用被拦截')
    return target.call(thisArg, ...argumentsList)
  },
}
const p = new Proxy(obj, handler)
p.foo // 输出：我被读取了foo属性
p.fn() // 输出：我被读取了fn属性 fn调用了
```

上述代码中，并没有拦截到 obj.fn() 函数调用操作，而却是只是输出了“我被读取了 fn 属性”。究其原因，我们可以再次从 Proxy 的定义里的关键词“基本操作”找到答案 。那么何为基本操作呢？在上述代码中就表明了对象属性的读取 p.foo 就是基本操作，与之对应的就是非基本操作，我们可以称之为复合操作。而 obj.fn() 就是一个典型的复合操作，它是由两个基本操作组成的分别是读取操作 obj.fn , 和函数调用操作（取到 obj.fn 的值再进行调用），而我们代理的对象是 obj，并不是 obj.fn。因此，我们只能拦截到 fn 属性的读取操作。这也说明了 **Proxy 只能对对象的基本操作进行代理**，这点尤为重要。

- 有些捕获器的参数中有`receiver`，它指的是**原始的操作所在的那个对象**。通常情况下是指代理对象本身，即 Proxy 实例。

例 1：

```js
let proxy = new Proxy(
  {},
  {
    get: function(target, propKey, receiver) {
      return receiver
    },
  }
)
proxy.getReceiver === proxy // true
```

上面代码中，proxy 对象的 getReceiver 属性会被 get()拦截，得到的返回值就是 proxy 对象。

例 2：

```js
let proxy = new Proxy(
  {},
  {
    get: function(target, propKey, receiver) {
      return receiver
    },
  }
)

let obj = Object.create(proxy)
obj.getReceiver === obj // true
```

上面代码中，obj 对象本身没有 getReceiver 属性，所以读取 obj.getReceiver 的时候，会去 obj 的原型 proxy 对象找。这时，receiver 就指向 obj，代表原始的读操作所在的那个对象。

例 3：

```js
let proxy = new Proxy(
  {},
  {
    set: function(target, propKey, value, receiver) {
      target[propKey] = receiver
      return true
    },
  }
)
const proxy = new Proxy({}, handler)
const myObj = {}
Object.setPrototypeOf(myObj, proxy)

myObj.foo = 'bar'
myObj.foo === myObj // true
```

上面代码中，设置 myObj.foo 属性的值时，myObj 并没有 foo 属性，因此引擎会到 myObj 的原型链去找 foo 属性。myObj 的原型对象 proxy 是一个 Proxy 实例，设置它的 foo 属性会触发 set 方法。这时，第四个参数 receiver 就指向原始赋值行为所在的对象 myObj。

- 如果目标对象自身的某个属性不可写（writable）且不可配置（configurable），那么 get 和 set 捕获器无法修改该属性，严格模式下会报错。
- set 捕获器应当返回一个布尔值。严格模式下，set 代理如果没有返回 true，就会报错。

### Proxy 的应用

#### 数组负索引

```js
const handler = {
  get(target, propKey, receiver) {
    const index = Number(propKey)
    if (index < 0) {
      propKey = String(target.length + index)
    }
    return Reflect.get(target, propKey, receiver)
  },
}
const arr = new Proxy([1, 2, 3], handler)
arr[-1] // 3
```

#### 内部属性的保护

```js
const handler = {
  has: function(target, key) {
    if (key[0] === '_') {
      return false
    }
    return key in target
  },
  ownKeys: function(target) {
    return Reflect.ownKeys(target).filter((key) => key[0] !== '_')
  },
  get: function(target, key, receiver) {
    if (key[0] === '_') {
      throw new Error(`私有属性 ${key} 不能访问`)
    }
    return Reflect.get(target, key, receiver)
    // 或者 return key in receiver ? target[key] : undefined
  },
}
```

#### 运算符重载

```js
const range = (min, max) =>
  new Proxy(
    {},
    {
      has: (target, prop) => Number(prop) >= min && Number(prop) <= max,
    }
  )

console.log(2 in range(1, 3)) // true
const nums = [1, 5, 50, 100]
console.log(nums.filter((n) => n in range(1, 10))) // [1, 5]
```

#### 解决层级很深的对象取值判断不严谨的问题

参考：[一个函数搞定线上 bug——proxy 代理方案](https://mp.weixin.qq.com/s/dkYH2V5Kf0Klyx2nYHfGVQ)

#### 表单验证

参考：[探索两种优雅的表单验证——策略设计模式和 ES6 的 Proxy 代理模式](https://mp.weixin.qq.com/s/V38Ooc4-3nnait2qRixSKw)

## Reflect

### Reflect 设计的目的

（1） 将 Object 对象的一些明显属于语言内部的方法（比如 `Object.defineProperty`），放到 Reflect 对象上。现阶段，某些方法同时在 Object 和 Reflect 对象上部署，未来的新方法将只部署在 Reflect 对象上。也就是说，从 Reflect 对象上可以拿到语言内部的方法。

（2） 修改某些 Object 方法的返回结果，让其变得更合理。比如，`Object.defineProperty(obj, name, desc)`在无法定义属性时，会抛出一个错误，而`Reflect.defineProperty(obj, name, desc)`则会返回 false。

（3） 让 Object 操作都变成函数行为。某些 Object 操作是命令式，比如`name in obj`和`delete obj[name]`，而`Reflect.has(obj, name)`和`Reflect.deleteProperty(obj, name)`让它们变成了函数行为。

（4）Reflect 对象的方法与 Proxy 对象的方法一一对应，只要是 Proxy 对象的方法，就能在 Reflect 对象上找到对应的方法。这就让 Proxy 对象可以方便地调用对应的 Reflect 方法，完成默认行为，作为修改行为的基础。也就是说，**不管 Proxy 怎么修改默认行为，你总可以在 Reflect 上获取默认行为**。

### Reflect 的静态方法

Reflect 对象一共有 13 个静态方法。

- `Reflect.apply(target, thisArg, args)`：等同于`Function.prototype.apply.call(target, thisArg, args)`，用于绑定函数的`this`对象，并执行函数。
- `Reflect.construct(target, args)`：等同于`new target(...args)`，这提供了一种不使用`new`，来调用构造函数的方法。
- `Reflect.get(target, name, receiver)`：获取对象身上某个属性的值，类似于`target[name]`。
- `Reflect.set(target, name, value, receiver)`：设置对象身上某个属性的值，类似于`target[name] = value`。
- `Reflect.defineProperty(target, name, desc)`：类似于`Object.defineProperty`，用于在对象上定义一个新属性或修改一个已经存在的属性，并返回一个布尔值。
- `Reflect.deleteProperty(target, name)`：类似于`delete obj[name]`，用于删除对象的属性，返回一个布尔值。
- `Reflect.has(target, name)`：类似于`name in obj`，用于检查对象是否具有某个属性，返回一个布尔值。
- `Reflect.ownKeys(target)`：类似于`Object.getOwnPropertyNames`和`Object.getOwnPropertySymbols`的合集，用于获取对象的所有属性名，返回一个数组。
- `Reflect.getOwnPropertyDescriptor(target, name)`：类似于`Object.getOwnPropertyDescriptor`，用于获取对象指定属性的描述对象。
- `Reflect.getPrototypeOf(target)`：类似于`Object.getPrototypeOf`，用于获取对象的原型对象。
- `Reflect.setPrototypeOf(target, prototype)`：类似于`Object.setPrototypeOf`，用于设置对象的原型对象。
- `Reflect.preventExtensions(target)`：类似于`Object.preventExtensions`，用于让一个对象变为不可扩展，返回一个布尔值。
- `Reflect.isExtensible(target)`：类似于`Object.isExtensible`，用于判断一个对象是否可扩展，返回一个布尔值。

### Reflect 在 Proxy 中的应用

```js
const obj = {
  foo: 'foo',
  get bar() {
    return this.foo
  },
}
const handler = {
  get(target, key, receiver) {
    console.log(`我被读取了${key}属性`)
    return target[key]
  },
  set(target, key, val, receiver) {
    console.log(`我被设置了${key}属性, val: ${val}`)
    target[key] = val
  },
}
const p = new Proxy(obj, handler)
p.bar // 输出：我被读取了bar属性
// Q： 为什么读取foo属性没有被拦截
```

定义了一个 foo 属性和 bar 属性，其中 bar 属性是一个访问器属性，通过 get 函数 return this.foo 获取得到的，因此按理来说我们在读取 bar 属性时候会触发读取 foo 属性，也同样会被 get 的 trap 所拦截到，但实际代码运行结果并没有拦截到 foo 属性。

这是为什么呢？答案的关键在于 bar 访问器里的 this 指向。梳理下代码运行过程：p.bar 实际上会被 handler 的 get 捕获，返回 target['bar']，而这里的 target 实际上就是 obj，所以这时候 bar 访问器里的 this 指向 obj，this.foo，实际就是 obj.foo。而 obj 并不是 proxy 对象 p，所以访问其 foo 属性并不会被拦截到。

那么如何也能触发到 foo 属性的拦截呢，这时候 Reflect 就派上用场了，有以下代码：

```js
const obj = {
  foo: 'foo',
  get bar() {
    return this.foo
  },
}
const handler = {
  get(target, key, receiver) {
    console.log(`我被读取了${key}属性`)
    // 注意下面的 receiver
    return Reflect.get(target, key, receiver)
  },
  set(target, key, val, receiver) {
    console.log(`我被设置了${key}属性, val: ${val}`)
    return Reflect.set(target, key, val, receiver)
  },
}
const p = new Proxy(obj, handler)
p.bar // 输出：我被读取了bar属性   我被读取了foo属性
```

如上面代码所示，我们能正确地触发了 foo 属性的拦截，其实现的关键在于 Reflect.get 的第三个参数 receiver ，其作用就是改变 this 指向。

建议在 proxy 对象拦截器里的属性方法都通过 `Reflex.*`去操作。

## 资料

- [你可能不知道的 Proxy](https://mp.weixin.qq.com/s/LFpHyiMHwsZ2aVKWqdM2hg)
