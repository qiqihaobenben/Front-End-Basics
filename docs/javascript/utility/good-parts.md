# 如何写好 JavaScript

## 各司其责

- HTML/CSS/JS 各司其责，HTML 负责结构，CSS 负责表现，JS 负责行为
- 应当避免不必要的由 JS 直接修改样式
- 如果使用 JS 修改样式，建议可以用 class 表示状态，使用 JS 进行 class 的切换
- 纯展示类交互寻求零 JS 方案

## 组件封装

前端组件指的是构成网页或 Web 应用的独立，可复用的界面功能单元，通常包含模版（HTML）、功能（JS）、样式（CSS）。好的组件具备封装性、正确性、扩展性、复用性。

### 组件封装基本方法

- 结构设计，创建 HTML 模板
- 展现效果，使用 class 更改样式
- 行为设计：
  - 功能实现使用 API
  - 控制流使用自定义事件 new CustomEvent

### 组件封装优化

#### 功能插件化

核心思想是将组件的依赖关系从内部创建转移到外部注入，即组件不再在自己内部自行创建所依赖的对象，而是由外部提供注入到组件中。这种设计模式就是依赖注入，用于实现控制反转的原则。

- 组件中可以将控制元素的逻辑抽取成插件，例如轮播图的底部控制按钮、左右切换按钮
- 插件和组件通过依赖注入的方式建立联系

#### 结构模板化

将 HTML 模板化，更有利于扩展

- 组件和插件都模板化，增加 render 方法

#### 框架抽象化

将通用的组件模型抽象出框架，具体的组件再通过继承，实现具体的细分组件

### 组件封装跟各司其责不冲突

封装的组件中还是 HTML 负责结构，CSS 负责表现，JS 负责行为

Vue 文档中关于如何看待关注点分离的说明：一些有着传统 Web 开发背景的用户可能会因为 单文件组件（SFC） 将不同的关注点集合在一处而有所顾虑，觉得 HTML/CSS/JS 应当是分离开的！

要回答这个问题，我们必须对这一点达成共识：**前端开发的关注点不是完全基于文件类型分离的。** 前端工程化的最终目的都是为了能够更好地维护代码。关注点分离不应该是教条式地将其视为文件类型的区别和分离，仅仅这样并不够帮我们在日益复杂的前端应用的背景下提高开发效率。

在现代的 UI 开发中，我们发现与其将代码库划分为三个巨大的层，相互交织在一起，不如将它们划分为松散耦合的组件，再按需组合起来。在一个组件中，其模板、逻辑和样式本就是有内在联系的、是耦合的，将它们放在一起，实际上使组件更有内聚性和可维护性。

## 过程抽象

过程抽象是指用来处理局部逻辑细节控制的一些方法，是函数式编程思想的基础应用。

可以简单理解为函数封装好了一个过程，之后只关注输入和输出，相同的输入有相同的输出（纯函数）。

例如以下工具函数：

- once：为了能够让“只执行一次”这个需求覆盖不同的事件处理，我们可以将只执行一次这个过程抽离出来，这就是过程抽象

```js
function once(fn) {
  return function(...args) {
    if (fn) {
      const result = fn.apply(this, args)
      fn = null
      return result
    }
  }
}
```

### 高阶函数（HOF）

- 以函数作为参数
- 以函数作为返回值
- 常用于作为函数装饰器

高阶函数或者说纯函数，有利于编写测试用例，提高项目的可维护性

### 编程范式

- 命令式（imperative）
  - 面向过程（procedural）：例如 C
  - 面向对象（object oriented）：例如 C++ JAVA
- 声明式（declaratve）
  - 函数式（function）：Haskell Erlang
  - 逻辑式/响应式（logic）：Prolog

JavaScript 是现代编程语言，命令式和声明式都支持

## 写代码更应该关注什么？

### 风格

代码简洁

### 效率

效率高，性能好

例如判断整数是否是 4 的幂

版本一：

```js
function isPowerOfFour(num) {
  // 边界处理
  num = parseInt(num)
  while (num > 1) {
    // 判断最可能的情况，可以直接阻断后续的流程的
    if (num % 4) return false
    num = num / 4
  }
  return num === 1
}
```

版本二：

```js
function isPowerOfFour(num) {
  // 边界处理
  num = parseInt(num)
  while (num > 1) {
    // 是用二进制按位与判断是否能被4整除
    if (num & 0b11) return false
    // 无符号右移两位，相当于除以4
    num = num >>> 2
  }
  return num === 1
}
```

版本三：时间复杂度 O

```js
function isPowerOfFour(num) {
  num = parseInt(num)
  // 1：如果是 4 的幂，所以 num 必大于 0
  // 2：num & (num - 1) 可以用来判断是否是 2 的幂，因为2的幂的二进制只有1个位上是1，其余都是0，4的幂肯定也是2的幂，如果不是2的幂，那肯定也不是4的幂。
  // 3：4的幂在二进制的偶数位肯定不是1，例如 100 10000 ，此时只要 & 一个 101010...10 不是0，那么就不是4的幂，101010...10 转化为16进制的数字，就是 OxAAAAAAAA，具体有多少个A，在进行位运算时，JavaScript中的数字被当作32位整数处理。这是因为位运算只对整数有意义。
  return num > 0 && (num & (num - 1)) === 0 && (num & 0xaaaaaaaa) === 0
}
```

### 使用场景

对于性能要求是否真的那么高，会不会存在过度抽象

#### 交通灯切换

版本一：显然是不好维护的

```js
const traffic = document.getElementById('traffic')

;(function reset() {
  traffic.className = 's1'

  setTimeout(function() {
    traffic.className = 's2'
    setTimeout(function() {
      traffic.className = 's3'
      setTimeout(function() {
        traffic.className = 's4'
        setTimeout(function() {
          traffic.className = 's5'
          setTimeout(reset, 1000)
        }, 1000)
      }, 1000)
    }, 1000)
  }, 1000)
})()
```

版本二：把数据进行了抽象

```js
const traffic = document.getElementById('traffic')

const stateList = [
  { state: 'wait', last: 1000 },
  { state: 'stop', last: 3000 },
  { state: 'pass', last: 3000 },
]

function start(traffic, stateList) {
  function applyState(stateIdx) {
    const { state, last } = stateList[stateIdx]
    traffic.className = state
    setTimeout(() => {
      applyState((stateIdx + 1) % stateList.length)
    }, last)
  }
  applyState(0)
}

start(traffic, stateList)
```

版本三：过程抽象，不过有些过度抽象了

```js
const traffic = document.getElementById('traffic')

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function poll(...fnList) {
  let stateIndex = 0

  return async function(...args) {
    let fn = fnList[stateIndex++ % fnList.length]
    return await fn.apply(this, args)
  }
}

async function setState(state, ms) {
  traffic.className = state
  await wait(ms)
}

let trafficStatePoll = poll(setState.bind(null, 'wait', 1000), setState.bind(null, 'stop', 3000), setState.bind(null, 'pass', 3000))

;(async function() {
  // noprotect
  while (1) {
    await trafficStatePoll()
  }
})()
```

版本四：异步 + 函数式

```js
const traffic = document.getElementById('traffic')

function wait(time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

function setState(state) {
  traffic.className = state
}

async function start() {
  //noprotect
  while (1) {
    setState('wait')
    await wait(1000)
    setState('stop')
    await wait(3000)
    setState('pass')
    await wait(3000)
  }
}

start()
```

### 设计

是否满足需求，会不会存在隐藏的问题

#### 洗牌算法

版本一：洗牌不均匀，小数字会大概率排在前面

```js
const cards = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

function shuffle(cards) {
  return [...cards].sort(() => (Math.random() > 0.5 ? -1 : 1))
}

console.log(shuffle(cards))
```

版本二：抽牌法，分布均匀

```js
const cards = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

function shuffle(cards) {
  const c = [...cards]
  for (let i = c.length; i > 0; i--) {
    const pIdx = Math.floor(Math.random() * i)
    ;[c[pIdx], c[i - 1]] = [c[i - 1], c[pIdx]]
  }
  return c
}
```

版本三：生成器，可以一张一张的抽

```js
const cards = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

function* draw(cards) {
  const c = [...cards]

  for (let i = c.length; i > 0; i--) {
    const pIdx = Math.floor(Math.random() * i)
    ;[c[pIdx], c[i - 1]] = [c[i - 1], c[pIdx]]
    yield c[i - 1]
  }
}

const result = draw(cards)
console.log([...result])
```

### 发红包

版本一：切西瓜，每次都是选取最大的切一刀，红包会比较平均 O(m\*n)，红包的个数不会很多，性能够用

```js
function generate(amount, count) {
  let ret = [amount]

  while (count > 1) {
    //挑选出最大一块进行切分
    let cake = Math.max(...ret),
      idx = ret.indexOf(cake),
      part = 1 + Math.floor((cake / 2) * Math.random()),
      rest = cake - part

    ret.splice(idx, 1, part, rest)

    count--
  }
  return ret
}
```

版本二：结合抽牌法，找出 9 个分割位置，把总钱数按照一分钱进行分割。

```js
function* draw(cards) {
  const c = [...cards]

  for (let i = c.length; i > 0; i--) {
    const pIdx = Math.floor(Math.random() * i)
    ;[c[pIdx], c[i - 1]] = [c[i - 1], c[pIdx]]
    yield c[i - 1]
  }
}

function generate(amount, count) {
  if (count <= 1) return [amount]
  const cards = Array(amount - 1)
    .fill(0)
    .map((_, i) => i + 1)
  const pick = draw(cards)
  const result = [0]
  for (let i = 0; i < count; i++) {
    result.push(pick.next().value)
  }
  result.sort((a, b) => a - b)
  result.push(amount)
  for (let i = result.length - 1; i > 0; i--) {
    result[i] = result[i] - result[i - 1]
  }
  result.shift()
  return result
}
```

以上几个因素要综合考虑权衡，简单的场景，对性能要求不是很高，就不用特别追求性能，此时代码风格简洁，设计合理较为重要，有些场景就是对性能要求很高，例如 3D 渲染，可能就需要降低一些代码风格的要求，采用性能最好的方式来实现。有时候也需要针对大数据量和小数据量进行分别的设计，例如 V8 引擎在实现数组的 sort 方法时，小数据量的数组会采用插入排序，大数据量的数组采用快速排序，这样能兼顾两种场景下的性能和效率。
