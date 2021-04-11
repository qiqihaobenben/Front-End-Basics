# JavaScript Promise 详解

Promise 规范有很多，如 Promise/A、Promise/B、Promise/D 以及 Promise/A+。最终 ES6 中采用了 Promise/A+规范。我们可以按照 Promise/A+ 规范，来从头实现一个 MyPromise。

## 1、Promise 的状态

一个 Promise 的状态必须为以下三种状态中的一种：等待态（Pending）、执行态（Fulfilled）、拒绝态（Rejected）

### 等待态（Pending）

处于等待态时，promise 满足以下条件：

可以迁移至执行态或拒绝态

### 执行态（Fulfilled）

处于执行态时，promise 满足以下条件：

- 不能迁移至其他任何状态
- 必须拥有一个**不可变**的终值

### 拒绝态（Rejected）

处于拒绝态时， promise 满足以下条件：

- 不能迁移至其他任何状态
- 必须拥有一个**不可变**的拒因

#### 术语解释

终值（eventual value）：所谓的终值，指的是 promise 被**解决**时传递给解决回调的值，因为 promise 有**一次性**的特征，因此当这个值被传递时，标志着 promise 等待态的结束，故称之为终值，有时候也直接简称为值（value），值可以是任何 JavaScript 合法值（包括 undefined、thenable 和 promise）

拒因（reason）：也就是拒绝原因，指的是 promise 被**拒绝**时传递给拒绝回调的值。

解决（fulfill）：指一个 promise 成功时（调用 resolve ）进行的一系列操作，如状态的改变，回调的执行。虽然规范中用 fulfill 表示解决，但现在的 promise 实现中多以 resolve 指代之。

拒绝（reject）: 指一个 promise 失败时（调用 reject 或抛出异常）进行的一系列操作。

> 代码更新

```js
const PENDING = 'Pending'
const FULFILLED = 'Fulfilled'
const REJECTED = 'Rejected'
```

## 2、Promise 构造函数

Promise 是一个构造函数，传参是一个函数，传入的函数接受两个参数，一个是解决回调 resolve，一个拒绝回调 reject。

> 代码更新

```js
const PENDING = 'Pending'
const FULFILLED = 'Fulfilled'
const REJECTED = 'Rejected'

/** 更新 */
function MyPromise(fn) {
  // 初始状态，可以迁移至其他任何状态
  this.status = PENDING
  const resolve = (value) => {}

  const reject = (reason) => {}
}
```

resolve 方法将 promise 的状态改为 Fulfilled ,并传入一个不可变的终值，reject 方法将 promise 的状态改为 Rejected，并传入一个不可变的拒因。promise 的状态一旦改为 Fulfilled 或者 Rejected 就不能再迁移至其他状态。

> 代码更新

```js
const PENDING = 'Pending'
const FULFILLED = 'Fulfilled'
const REJECTED = 'Rejected'

function MyPromise(fn) {
  // 初始状态，可以迁移至其他任何状态
  this.status = PENDING
  // 终值
  this.value = null
  // 拒因
  this.reason = null

  const resolve = (value) => {
    // 如果状态不为 Pending，不能再迁移至其他状态
    if (this.status !== PENDING) return
    this.status = FULFILLED
    this.value = value
  }

  const reject = (reason) => {
    // 如果状态不为 Pending，不能再迁移至其他状态
    if (this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
  }
}
```

调用构造函数的参数 fn，将 resolve 和 reject 作为参数传入 fn，记得加上 try，如果捕获到错误就 reject。

> 代码更新

```js
const PENDING = 'Pending'
const FULFILLED = 'Fulfilled'
const REJECTED = 'Rejected'

function MyPromise(fn) {
  // 初始状态，可以迁移至其他任何状态
  this.status = PENDING
  // 终值
  this.value = null
  // 拒因
  this.reason = null

  const resolve = (value) => {
    // 如果状态不为 Pending，不能再迁移至其他状态
    if (this.status !== PENDING) return
    this.status = FULFILLED
    this.value = value
  }

  const reject = (reason) => {
    // 如果状态不为 Pending，不能再迁移至其他状态
    if (this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
  }
  /** 更新 */
  // 如果有异常抛出，promise 就 reject
  try {
    fn(resolve, reject)
  } catch (error) {
    reject(error)
  }
}
```

## 3、Then 方法

一个 promise 必须提供一个 then 实例方法以访问其终值和拒因。

promise 的 then 方法接受两个参数：

`promise.then(onFulfilled, onRejected)`

onFulfilled 和 onRejected 都是可选参数。

> 代码更新

```js
MyPromise.prototype.then = function(onFulfilled, onRejected) {}
```

### onFulfilled

如果 onFulfilled 不是函数，其必须被忽略。所谓的“忽略”并不是什么都不干，对于 onFulfilled 来说，忽略就是将接收到的 value 直接返回。

如果 onFulfilled 是函数：

- 当 promise 执行结束后其必须被调用，其第一个参数为 promise 的终值
- 当 promise 执行结束前其不可被调用
- 其调用次数不可超过一次

### onRejected

如果 onRejected 不是函数，其必须被忽略。所谓的“忽略”并不是什么都不干，对于 onRejected 来说就是返回 reason，因为 onRejected 是一个拒绝分支，触发之后的拒绝状态，应该抛出一个异常，所以返回的 reason 应该 throw 一个 Error

如果 onRejected 是函数：

- 当 promise 被拒绝后其必须被调用，其第一个参数为 promise 的拒因
- 在 promise 被拒绝之前其不可被调用
- 其调用次数不可超过一次

### 调用时机

onFulfilled 和 onRejected 只有在执行环境堆栈仅包含平台代码时才可被调用。实践中要确保 onFulfilled 和 onRejected 方法异步执行，且应该在`then`方法被调用的那一轮事件循环之后的新执行栈中执行。

### 调用要求

onFulfilled 和 onRejected 必须被作为函数调用（即没有 this 值）

### 多次调用

then 方法可以被同一个 promise 调用多次

- 当 promise 成功执行时，所有 onFulfilled 需按照其注册顺序依次回调
- 当 promise 被拒绝时，所有的 onRejected 需按照其注册顺序依次回调

> 代码更新

```js
const PENDING = 'Pending'
const FULFILLED = 'Fulfilled'
const REJECTED = 'Rejected'

function MyPromise(fn) {
  // 初始状态，可以迁移至其他任何状态
  this.status = PENDING
  // 终值
  this.value = null
  // 拒因
  this.reason = null
  /** 更新 */
  // 成功后的 onFulfilled 的回调列表
  this.onFulfilledCallbacks = []
  // 被拒绝后的 onRejected 的回调列表
  this.onRejectedCallbacks = []

  const resolve = (value) => {
    // 如果状态不为 Pending，不能再迁移至其他状态
    if (this.status !== PENDING) return
    this.status = FULFILLED
    this.value = value
    // resolve 时把所有成功的回调拿出来执行
    this.onFulfilledCallbacks.forEach((callback) => {
      callback(this.value)
    })
  }

  const reject = (reason) => {
    // 如果状态不为 Pending，不能再迁移至其他状态
    if (this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
    // reject时把所有失败的回调拿出来执行
    this.onRejectedCallbacks.forEach((callback) => {
      callback(this.reason)
    })
  }

  try {
    fn(resolve, reject)
  } catch (error) {
    reject(error)
  }
}

MyPromise.prototype.then = function(onFulfilled, onRejected) {
  // 如果 onFulfilled 不是函数，就给一个默认函数，返回 vallue
  let realOnFulfilled = onFulfilled
  if (typeof realOnFulfilled !== 'function') {
    realOnFulfilled = function(value) {
      return value
    }
  }
  // 如果 onRejected 不是函数，就给一个默认函数，抛出异常
  let realOnRejected = onRejected
  if (typeof realOnRejected !== 'function') {
    realOnRejected = function(reason) {
      throw reason
    }
  }

  // 下面一步一步实现规范中的其他描述
  // 1、参数检查完后，按照规范，如果promise执行成功就会调用 onFulfilled，如果失败了，就会调用 onRejected 。在之后的代码里，我们就应该检查 promise 的 status，如果是 FULFILLED，就调用 onFulfilled，如果是 REJECTED，就调用 onRejected
  // 2、onFulfilled 和 onRejected 只有在执行环境堆栈仅包含平台代码时才可被调用。意思是实践中要确保 onFulfilled 和 onRejected 方法异步执行，且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行，所以我们执行 onFulfilled 和 onRejected 的时候都应该包到 setTimeout 里面去。

  if (this.status === FULFILLED) {
    setTimeout(() => {
      realOnFulfilled(this.value)
    }, 0)
  }

  if (this.status === REJECTED) {
    setTimeout(() => {
      realOnRejected(this.reason)
    }, 0)
  }

  // 2、then 一般是在实例对象一创建好就调用了，这时候构造函数的传参 fn 中可能有异步操作还没结束，也就是说 promise 的状态还是 PENDING，还不知道 promise 到底是成功还是失败。那什么时候知道 promise 成功还是失败呢？答案是 fn 里面主动调用 resolve 或者 reject 的时候。所以如果 promise 的 status 还是 PENDING，就应该将 onFulfilled 和 onRejected 两个回调保存起来，等 fn 有了结论，主动调用了 resolve 或 reject 的时候再来调用对应的回调。规范中还提到 then 方法可以被同一个 promise 调用多次，所以会有多个 onFulfilled 和 onRejected，我们可以用两个数组将它们存起来，等 resolve 或者 reject 的时候将数组里面的回调函数循环执行一遍

  if (this.status === PENDING) {
    this.onFulfilledCallbacks.push(() => {
      setTimeout(() => {
        realOnFulfilled(this.value)
      }, 0)
    })
    this.onRejectedCallbacks.push(() => {
      setTimeout(() => {
        realOnRejected(this.reason)
      }, 0)
    })
  }
}
```

### 返回

then 方法必须返回一个新的 promise 对象

`promise2 = promise1.then(onFulfilled, onRejected)`

- 如果 onFulfilled 或者 onRejected 返回一个值 x，则运行下面的**Promise 解决过程**：`[[Resolve]](promise2, x)`
- 如果 onFulfilled 或者 onRejected 抛出一个异常 e，则 promise2 必须被拒绝，并返回拒因 e
- 如果 onFulfilled 不是函数且 promise1 成功执行，promise2 必须成功执行并返回相同的值
- 如果 onRejected 不是函数且 promise1 被拒绝，promise2 必须被拒绝并返回相同的拒因。

```js
const PENDING = 'Pending'
const FULFILLED = 'Fulfilled'
const REJECTED = 'Rejected'

function MyPromise(fn) {
  // 初始状态，可以迁移至其他任何状态
  this.status = PENDING
  // 终值
  this.value = null
  // 拒因
  this.reason = null

  // 成功后的 onFulfilled 的回调列表
  this.onFulfilledCallbacks = []
  // 被拒绝后的 onRejected 的回调列表
  this.onRejectedCallbacks = []

  const resolve = (value) => {
    // 如果状态不为 Pending，不能再迁移至其他状态
    if (this.status !== PENDING) return
    this.status = FULFILLED
    this.value = value
    // resolve 时把所有成功的回调拿出来执行
    this.onFulfilledCallbacks.forEach((callback) => {
      callback(this.value)
    })
  }

  const reject = (reason) => {
    // 如果状态不为 Pending，不能再迁移至其他状态
    if (this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
    // reject时把所有失败的回调拿出来执行
    this.onRejectedCallbacks.forEach((callback) => {
      callback(this.reason)
    })
  }

  try {
    fn(resolve, reject)
  } catch (error) {
    reject(error)
  }
}

MyPromise.prototype.then = function(onFulfilled, onRejected) {
  // 如果 onFulfilled 不是函数，就给一个默认函数，返回 value
  let realOnFulfilled = onFulfilled
  if (typeof realOnFulfilled !== 'function') {
    realOnFulfilled = function(value) {
      return value
    }
  }
  // 如果 onRejected 不是函数，就给一个默认函数，抛出异常
  let realOnRejected = onRejected
  if (typeof realOnRejected !== 'function') {
    realOnRejected = function(reason) {
      throw reason
    }
  }
  // 更新1、参数检查完后，按照规范，如果 promise 执行成功就会调用 onFulfilled，如果失败了，就会调用 onRejected 。在之后的代码里，我们就应该检查 promise 的 status，如果是 FULFILLED，就调用 onFulfilled，如果是 REJECTED，就调用 onRejected
  /** 根据规范 then 的返回值必须是一个 promise，规范还定义了不同情况应该怎么处理，先从简单的开始 */
  // 更新2、如果 onFulfilled 或者 onRejected 抛出一个异常 e，则 promise2 必须被拒绝，并返回拒因 e 。所以在 FULFILLED 和 REJECTED 的时候就不能简单的运行 onFulfilled 和 onRejected 了，需要将它们用 try...catch... 包起来，如果有错就 reject 了。
  // 更新3、如果 onFulfilled 或者 onRejected 返回一个值 x，则运行下面的 Promise 解决过程：[[Resolve]](promise2, x)。上面的代码中，只要 onRejected 或者 onFulfilled 成功执行了，我们都要 resolve promise2 。多了这一条我们还需要对 onRejected 或者 onFulfilled 的返回值进行判断，如果有返回值就要进行 Promise 解决过程。我们可以专门实现一个 resolvePromise 方法来进行 Promise 的解决过程。前面的代码实现，其实只要 onRejected 或者 onFulfilled 成功执行了，我们都需要 resolve promise2，这个过程可以放到这个方法里面。
  if (this.status === FULFILLED) {
    var promise2 = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (typeof onFulfilled !== 'function') {
            resolve(this.value)
          } else {
            var x = realOnFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject) // 调用Promise解决过程
          }
        } catch (error) {
          reject(error)
        }
      }, 0)
    })
    return promise2
  }

  // 更新2、如果onRejected不是函数且promise1被拒绝，promise2必须拒绝并返回相同的拒因
  if (this.status === REJECTED) {
    var promise2 = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (typeof onRejected !== 'function') {
            reject(this.reason)
          } else {
            // 注意，如果 promise1 的 onRejected 执行成功了，promise2 应该被 resolve，并且 onRejected 有返回值，就需要执行 resolvePromise
            var x = realOnRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          }
        } catch (error) {
          reject(error)
        }
      }, 0)
    })
    return promise2
  }

  // 2、then 一般是在实例对象一创建好就调用了，这时候构造函数的传参fn中可能有异步操作还没结束，也就是说 promise 的状态还是 PENDING，还不知道 promise 到底是成功还是失败。那什么时候知道 promise 成功还是失败呢？答案是 fn 里面主动调用 resolve 或者 reject 的时候。所以如果 promise 的 status 还是 PENDING，就应该将 onFulfilled 和 onRejected 两个回调保存起来，等 fn 有了结论，主动调用了 resolve 或 reject 的时候再来调用对应的回调。规范中还提到 then 方法可以被同一个 promise 调用多次，所以会有多个 onFulfilled 和 onRejected，我们可以用两个数组将它们存起来，等 resolve 或者 reject 的时候将数组里面的回调函数循环执行一遍
  // 同上、更新2、更新3、如果还是 PENDING 状态，也不能直接保存回调方法，需要包一层来捕获错误。有返回值 x，就运行 Promise 的解决过程

  if (this.status === PENDING) {
    var promise2 = new MyPromise((resolve, reject) => {
      this.onFulfilledCallbacks.push(() => {
        setTimeout(() => {
          try {
            if (typeof onFulfilled !== 'function') {
              resolve(this.value)
            } else {
              var x = realOnFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            }
          } catch (error) {
            reject(error)
          }
        }, 0)
      })
      this.onRejectedCallbacks.push(() => {
        setTimeout(() => {
          try {
            if (typeof onRejected !== 'function') {
              reject(this.reason)
            } else {
              // 注意，如果 promise1 的 onRejected 执行成功了，promise2 应该被 resolve，并且 onRejected 有返回值，就需要执行 resolvePromise
              var x = realOnRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            }
          } catch (error) {
            reject(error)
          }
        }, 0)
      })
    })
    return promise2
  }
}
```

## Promise 解决过程

onFulfilled 或者 onRejected 返回一个值 x，则运行 Promise 解决过程。

Promise 解决过程是一个抽象的操作，其需输入一个 promise 和一个值 x，我们表示为`[[Resolve]](promise2, x)`，如果 x 有 then 方法，且看上去像一个 Promise（thenable），解决程序及尝试使 promise2 接受 x 的状态；否则其用 x 的值来执行（resolve） promise2。

运行`[[Resolve]](promise2, x)`需遵循以下步骤：

#### x 与 promise2 相等

如果 promise2 和 x 指向同一对象，以 TypeError 为拒因拒绝 promise2。

#### x 为 Promise

如果 x 为 Promise，则使 promise2 接受 x 的状态：

- 如果 x 处于等待态，promise2 需保持为等待态直至 x 被执行或拒绝
- 如果 x 处于执行态，用相同的值执行 promise2
- 如果 x 处于拒绝态，用相同的拒因拒绝 promise2

#### x 为对象或函数

如果 x 为对象或者函数：

- 把 `x.then` 赋值给 then
- 如果取 x.then 的值时抛出错误 e，则以 e 为拒因拒绝 promise2
- 如果 then 是函数，将 x 作为函数的作用域 this 调用之。传递两个回调函数作为参数，第一个参数叫做 resolvePromise，第二个参数叫做 rejectPromise:
  - 如果 resolvePromise 以值 y 为参数被调用，则运行 `[[Resolve]](promise2, y)`
  - 如果 rejectPromise 以拒因 r 为参数被调用，则以拒因 r 拒绝 promise2
  - 如果 resolvePromise 和 rejectPromise 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
  - 如果调用 then 方法抛出了异常 e：
    - 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
    - 否则以 e 为拒因拒绝 promise2
- 如果 then 不是函数，以 x 为参数执行 promise2

#### 如果 x 不为对象或者函数，以 x 为参数执行 promise2

```js
/** Promise 解决过程 */
function resolvePromise(promise2, x, resolve, reject) {
  // 如果 promise2 和 x 指向同一对象，以 TypeError 为拒因拒绝 promise2
  if (promise2 === x) {
    return reject(
      new TypeError('The promise and the return value are the same')
    )
  }

  // 如果 x 为 Promise，则使 promise2 接受 x 的状态，也就是继续执行 x，如果解决回调执行的时候拿到一个 y，还需要继续解析 y
  if (x instanceof MyPromise) {
    x.then(function(y) {
      resolvePromise(promise2, y, resolve, reject)
    }, reject)
  } else if (
    Object.prototype.toString.call(x) === '[object Object]' ||
    typeof x === 'function'
  ) {
    try {
      // 把 x.then 赋值给 then
      var then = x.then
    } catch (error) {
      // 如果取 x.then 的值时抛出错误 e，则以 e 为拒因拒绝 promise
      return reject(error)
    }

    if (typeof then === 'function') {
      var called = false
      // 将 x 作为函数的作用域 this 调用之，传递两个回调函数作为参数，第一个参数叫做 resolvePromise，第二个参数叫做 rejectPromise，就是一个名字而已，可以直接传入的两个匿名函数
      try {
        then.call(
          x,
          // 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise2, y)
          function(y) {
            // 如果 resolvePromise 和 rejectPromise 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
            // 实现这条需要前面加一个变量 called
            if (called) return
            called = true
            resolvePromise(promise2, y, resolve, reject)
          },
          // 如果 rejectPromise 以拒因 r 为参数被调用
          function(r) {
            if (called) return
            called = true
            reject(r)
          }
        )
      } catch (error) {
        // 如果调用 then 方法抛出异常 e
        // 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
        if (called) return

        //否则以 e 为拒因拒绝 promise2
        reject(error)
      }
    } else {
      // 如果 then 不是函数，以 x 为参数执行 promise2
      resolve(x)
    }
  } else {
    // 如果 x 不为对象或者函数，以 x 为参数执行 promise2
    resolve(x)
  }
}
```

## 最终代码汇总

```js
const PENDING = 'Pending'
const FULFILLED = 'Fulfilled'
const REJECTED = 'Rejected'

function MyPromise(fn) {
  // 初始状态，可以迁移至其他任何状态
  this.status = PENDING
  // 终值
  this.value = null
  // 拒因
  this.reason = null

  // 成功后的 onFulfilled 的回调列表
  this.onFulfilledCallbacks = []
  // 被拒绝后的 onRejected 的回调列表
  this.onRejectedCallbacks = []

  const resolve = (value) => {
    // 如果状态不为 Pending，不能再迁移至其他状态
    if (this.status !== PENDING) return
    this.status = FULFILLED
    this.value = value
    // resolve 时把所有成功的回调拿出来执行
    this.onFulfilledCallbacks.forEach((callback) => {
      callback(this.value)
    })
  }

  const reject = (reason) => {
    // 如果状态不为 Pending，不能再迁移至其他状态
    if (this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
    // reject时把所有失败的回调拿出来执行
    this.onRejectedCallbacks.forEach((callback) => {
      callback(this.reason)
    })
  }

  try {
    fn(resolve, reject)
  } catch (error) {
    reject(error)
  }
}

MyPromise.prototype.then = function(onFulfilled, onRejected) {
  // 如果 onFulfilled 不是函数，就给一个默认函数，返回 value
  let realOnFulfilled = onFulfilled
  if (typeof realOnFulfilled !== 'function') {
    realOnFulfilled = function(value) {
      return value
    }
  }
  // 如果 onRejected 不是函数，就给一个默认函数，抛出异常
  let realOnRejected = onRejected
  if (typeof realOnRejected !== 'function') {
    realOnRejected = function(reason) {
      throw reason
    }
  }
  // 更新1、参数检查完后，按照规范，如果 promise 执行成功就会调用 onFulfilled，如果失败了，就会调用 onRejected 。在之后的代码里，我们就应该检查 promise 的 status，如果是 FULFILLED，就调用 onFulfilled，如果是 REJECTED，就调用 onRejected
  /** 根据规范 then 的返回值必须是一个 promise，规范还定义了不同情况应该怎么处理，先从简单的开始 */
  // 更新2、如果 onFulfilled 或者 onRejected 抛出一个异常 e，则 promise2 必须被拒绝，并返回拒因 e 。所以在 FULFILLED 和 REJECTED 的时候就不能简单的运行 onFulfilled 和 onRejected 了，需要将它们用 try...catch... 包起来，如果有错就 reject 了。
  // 更新3、如果 onFulfilled 或者 onRejected 返回一个值 x，则运行下面的 Promise 解决过程：[[Resolve]](promise2, x)。上面的代码中，只要 onRejected 或者 onFulfilled 成功执行了，我们都要 resolve promise2 。多了这一条我们还需要对 onRejected 或者 onFulfilled 的返回值进行判断，如果有返回值就要进行 Promise 解决过程。我们可以专门实现一个 resolvePromise 方法来进行 Promise 的解决过程。前面的代码实现，其实只要 onRejected 或者 onFulfilled 成功执行了，我们都需要 resolve promise2，这个过程可以放到这个方法里面。
  if (this.status === FULFILLED) {
    var promise2 = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (typeof onFulfilled !== 'function') {
            resolve(this.value)
          } else {
            var x = realOnFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject) // 调用Promise解决过程
          }
        } catch (error) {
          reject(error)
        }
      }, 0)
    })
    return promise2
  }

  // 更新2、如果onRejected不是函数且promise1被拒绝，promise2必须拒绝并返回相同的拒因
  if (this.status === REJECTED) {
    var promise2 = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (typeof onRejected !== 'function') {
            reject(this.reason)
          } else {
            // 注意，如果 promise1 的 onRejected 执行成功了，promise2 应该被 resolve，并且 onRejected 有返回值，就需要执行 resolvePromise
            var x = realOnRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          }
        } catch (error) {
          reject(error)
        }
      }, 0)
    })
    return promise2
  }

  // 2、then 一般是在实例对象一创建好就调用了，这时候构造函数的传参fn中可能有异步操作还没结束，也就是说 promise 的状态还是 PENDING，还不知道 promise 到底是成功还是失败。那什么时候知道 promise 成功还是失败呢？答案是 fn 里面主动调用 resolve 或者 reject 的时候。所以如果 promise 的 status 还是 PENDING，就应该将 onFulfilled 和 onRejected 两个回调保存起来，等 fn 有了结论，主动调用了 resolve 或 reject 的时候再来调用对应的回调。规范中还提到 then 方法可以被同一个 promise 调用多次，所以会有多个 onFulfilled 和 onRejected，我们可以用两个数组将它们存起来，等 resolve 或者 reject 的时候将数组里面的回调函数循环执行一遍
  // 同上、更新2、更新3、如果还是 PENDING 状态，也不能直接保存回调方法，需要包一层来捕获错误。有返回值 x，就运行 Promise 的解决过程

  if (this.status === PENDING) {
    var promise2 = new MyPromise((resolve, reject) => {
      this.onFulfilledCallbacks.push(() => {
        setTimeout(() => {
          try {
            if (typeof onFulfilled !== 'function') {
              resolve(this.value)
            } else {
              var x = realOnFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            }
          } catch (error) {
            reject(error)
          }
        }, 0)
      })
      this.onRejectedCallbacks.push(() => {
        setTimeout(() => {
          try {
            if (typeof onRejected !== 'function') {
              reject(this.reason)
            } else {
              // 注意，如果 promise1 的 onRejected 执行成功了，promise2 应该被 resolve，并且 onRejected 有返回值，就需要执行 resolvePromise
              var x = realOnRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            }
          } catch (error) {
            reject(error)
          }
        }, 0)
      })
    })
    return promise2
  }
}

/** Promise 解决过程 */
function resolvePromise(promise2, x, resolve, reject) {
  // 如果 promise2 和 x 指向同一对象，以 TypeError 为拒因拒绝 promise2
  if (promise2 === x) {
    return reject(
      new TypeError('The promise and the return value are the same')
    )
  }

  // 如果 x 为 Promise，则使 promise2 接受 x 的状态，也就是继续执行 x，如果解决回调执行的时候拿到一个 y，还需要继续解析 y
  if (x instanceof MyPromise) {
    x.then(function(y) {
      resolvePromise(promise2, y, resolve, reject)
    }, reject)
  } else if (
    Object.prototype.toString.call(x) === '[object Object]' ||
    typeof x === 'function'
  ) {
    try {
      // 把 x.then 赋值给 then 因为x.then有可能是一个getter，这种情况下多次读取就有可能产生副作用，所以在此处取出来
      var then = x.then
    } catch (error) {
      // 如果取 x.then 的值时抛出错误 e，则以 e 为拒因拒绝 promise
      return reject(error)
    }

    if (typeof then === 'function') {
      var called = false
      // 将 x 作为函数的作用域 this 调用之，传递两个回调函数作为参数，第一个参数叫做 resolvePromise，第二个参数叫做 rejectPromise，就是一个名字而已，可以直接传入的两个匿名函数
      try {
        then.call(
          x,
          // 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise2, y)
          function(y) {
            // 如果 resolvePromise 和 rejectPromise 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
            // 实现这条需要前面加一个变量 called
            if (called) return
            called = true
            resolvePromise(promise2, y, resolve, reject)
          },
          // 如果 rejectPromise 以拒因 r 为参数被调用
          function(r) {
            if (called) return
            called = true
            reject(r)
          }
        )
      } catch (error) {
        // 如果调用 then 方法抛出异常 e
        // 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
        if (called) return

        //否则以 e 为拒因拒绝 promise2
        reject(error)
      }
    } else {
      // 如果 then 不是函数，以 x 为参数执行 promise2
      resolve(x)
    }
  } else {
    // 如果 x 不为对象或者函数，以 x 为参数执行 promise2
    resolve(x)
  }
}
```

## 其他 Promise 的方法

ES6 的 Promise 还有很多 API，这些 API 都可以用我们按照 promise/A+规范实现的代码，再进行封装得到。

### Promise.resolve

返回一个以给定值解析后的 Promise 实例，换句话说就是将传入的值转换为 Promise 对象。如果传参是 Promise，直接返回，如果是 thenable 对象，返回的 Promise 实例会采用 thenable 的运行后的状态，如果不是前面两种类型，那就返回一个新的 Promise 实例，状态为 Fulfilled。

```js
MyPromise.resolve = (parameter) => {
  // 如果传参是一个 Promise，直接返回这个 Promise
  if (parameter instanceof MyPromise) {
    return parameter
  }
  // 简单起见，直接把后两种情况一起处理
  var promise = new MyPromise((resolve) => {
    resolve(parameter)
  })
  return promise.then((value) => {
    return value
  })
}
```

### Promise.reject

返回一个新的 Promise 实例，该实例的状态为 Rejected。Promise.reject 方法的参数 reason，会被传递给实例的回调函数。

```js
MyPromise.reject = (reason) => {
  return new MyPromise((resolve, reject) => {
    reject(reasion)
  })
}
```

### Promise.all

该方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。

该方法接收的参数是 promise 的 iterate 类型（例如：Array、Map、Set），一般是一个数组，并且只返回一个 Promise 实例，这个实例的 resolve 回调结果是一个数组。**必须注意：返回的这个数组每一项的顺序将会按照传入时参数的 promise 顺序排列，而不是由调用 promise 的完成顺序决定**

传入参数 iterate 类型中每一项都是 promise 实例，如果不是，就会先调用 Promise.resolve 方法转为 Promise 实例，再进一步处理。当 iterate 类型的每一项都 resolve，返回的 promise 才 resolve，有任何一个 reject ，返回的 promise 就 reject，并且 reject 的是第一个抛出的错误信息。

```js
MyPromise.all = (promiseList) => {
  let result = []
  let count = 0
  let length = promiseList.length
  let combinePromise = new MyPromise((resolve, reject) => {
    // 如果传入的参数是一个空的可迭代对象，直接返回一个 Fulfilled 状态的 Promise
    if (length === 0) {
      return resolve(result)
    }
    // 其他情况下返回的是一个 Pending 的 Promise，这个返回的 promise，之后会在所有 promise 都完成或有一个 promise 失败时*异步*地变为完成或失败
    promiseList.forEach((promise, index) => {
      MyPromise.resolve(promise).then(
        (value) => {
          count++
          // 将会按照参数内的 promise 顺序排列，而不是由调用 promise 的完成顺序决定
          result[index] = value
          if (count === length) {
            resolve(result)
          }
        },
        (reason) => {
          reject(reason)
        }
      )
    })
  })

  return combinePromise
}
```

### Promise.race

该方法同样也是将多个 Promise 实例包装成一个新的 Promise 实例。

Promise.race(iterate) 方法返回一个 promise，一旦迭代器中的某个 promise 解决或拒绝，返回的 promise 就会解决或拒绝。

```js
MyPromise.race = (promiseList) => {
  let length = promiseList.length
  return new MyPromise((resolve, reject) => {
    if (length === 0) {
      return resolve()
    }
    promiseList.forEach((promise) => {
      MyPromise.resolve(promise).then(
        (value) => {
          resolve(value)
        },
        (reason) => {
          reject(reason)
        }
      )
    })
  })
}
```

### Promise.allSettled

ES2020 引入，该方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。只有等到所有这些参数示例都返回结果，不管是 fulfilled 还是 rejected ，新的 Promise 才会结束，一旦结束，状态总是 fulfilled， 不会变成 rejected。状态变成 fulfilled 后，解决回调函数接收到的参数是一个数组，每一项表示对应的 promise 的结果，并且每一项的格式为 {status: "fulfilled", value: xxx} 或 {status: "rejected" reason： xxx}

```js
MyPromise.allSettled = (promiseList) => {
  let mapPromises = promiseList.map((promise) => {
    return MyPromise.resolve(promise).then(
      (value) => {
        return {
          status: 'fulfilled',
          value,
        }
      },
      (reason) => {
        return {
          status: 'rejected',
          reason,
        }
      }
    )
  })

  return MyPromise.all(mapPromises)
}
```

### Promise.any

ES2021 引入，该方法接受一个 promise 可迭代对象，只要其中一个 promise 成功，就返回那个已经成功的 promise，如果所有的 promise 都失败了，就返回一个失败的 promise，拒因为一个把单个错误合在一起的 AggregateError。本质上，此方法跟 Promise.all 相反。

```js
MyPromise.any = (promiseList) => {
  return MyPromise.all(
    promiseList.map((promise) => {
      // 如果一个promise失败，就将其转换成已解决，等待之后可能的成功，如果其中一个promise成功了，将其转换成拒绝，Promise.all会立即退出。
      return promise.then(
        (value) => MyPromise.reject(value),
        (reason) => MyPromise.resolve(reason)
      )
    })
  ).then(
    // 如果 '.all' 被解决，我们就得到了一个 errors 的数组
    (errors) => MyPromise.reject(errors),
    // 如果 '.all' 被拒绝，我们就得到了第一个成功的promise的结果
    (value) => MyPromise.resolve(value)
  )
}
```

### Promise.prototype.catch

`Promise.prototype.catch` 方法是 `.then(null, onRejected)` 或 `.then(undefined, onRejected)` 的别名，用于指定发生错误时的回调函数。

如果 onRejected 抛出一个错误或返回一个本身失败的 Promise，通过 catch() 返回的 Promise 会被 reject；否则，返回的 Promise 会被 resolve。

```js
MyPromise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected)
}
```

### Promise.prototype.finally

用于指定不管 Promise 对象最后状态如何，都会执行的操作。该方法是 ES2018 引入的。

```js
MyPromise.prototype.finally = function(callback) {
  return this.then(
    (value) => {
      return MyPromise.resolve(callback()).then(() => {
        return value
      })
    },
    (reason) => {
      return MyPromise.resolve(callback()).then(() => {
        throw reason
      })
    }
  )
}
```

### 一些自己实现的其他的方法

```js
// 实现 cancel 和 stop ，用来停止一个 Promise 链
MyPromise.cancel = MyPromise.stop = function() {
  return new MyPromise(function() {})
}

// Promise 链上返回的最后一个 Promise 出错了，就会被内部的 try...catch 吞掉，可以实现一个done方法
Promise.prototype.done = function() {
  return this.catch(function(e) {
    // 此处一定要确保这个函数不能再出错
    console.error(e)
  })
}
```

## 测试

我们可以使用 Promise/A+官方的测试工具 promises-aplus-tests 来对自己实现的 MyPromise 进行测试，要使用这个工具我们必须实现一个静态方法 deferred ：

> deferred：返回一个包含 {promise, resolve, reject} 的对象
> promise 是一个处于 pending 状态的 promise
> resolve(value) 用 value 解决上面那个 promise
> reject(reason) 用 reason 拒绝上面那个 promise

新建一个 adater.js 文件：

```js
const MyPromise = require('./my-promise')

MyPromise.deferred = () => {
  let promise, resolve, reject
  promise = new MyPromise(($resolve, $reject) => {
    resolve = $resolve
    reject = $reject
  })
  return { promise, resolve, reject }
}

module.exports = MyPromise
```

然后再 `npm install promises-aplus-tests` ， 在配置好 package.json ：

```json
{
  "devDependencies": {
    "promises-aplus-tests": "^2.1.2"
  },
  "scripts": {
    "test": "promises-aplus-tests adater"
  }
}
```

`npm run test` 就可以跑测试了

## 注意

### ES6 Promise 中 resolve 传值

ES6 的 Promise，在调用 resolve，传入一个 promise 实例时，即使在 onFulfilled 中不返回这个实例，后续的链式操作，也会以这个传入的实例状态为准，而我们自己实现的 MyPromise 必须在 onFulfilled 中返回传入的实例，走到 resolvePromise 环节，后续的链式操作才会以传入的实例状态为准。

```js
const p1 = new Promise(function(resolve, reject) {
  setTimeout(() => reject(new Error('fail')), 3000)
})
const p2 = new Promise(function(resolve, reject) {
  setTimeout(() => resolve(p1), 1000)
})
p2.then((result) => console.log(result)).catch((error) => console.log(error))
// Error: fail
```

## 推荐文章

- [Promises/A+规范](https://www.ituring.com.cn/article/66566)
- [手写一个 Promise/A+,完美通过官方 872 个测试用例](https://juejin.cn/post/6844904116913700877)
- [手把手教你实现 Promise（主要是前面几个状态图可以看一下）](https://mp.weixin.qq.com/s/Jtoih03FPUwahbzVdDCZxw)
- [你真的懂 Promise 吗](https://github.com/ljianshu/Blog/issues/81)
- [从 Promise 的 Then 说起](http://www.alloyteam.com/2016/03/from-the-promise-then-said-on/?f=http://blogread.cn/)
- [100 行代码实现 Promises/A+ 规范](https://mp.weixin.qq.com/s/qdJ0Xd8zTgtetFdlJL3P1g)
- [剖析 Promise 内部结构，一步一步实现一个完整的、能通过所有 Test case 的 Promise 类](https://github.com/xieranmaya/blog/issues/3)
