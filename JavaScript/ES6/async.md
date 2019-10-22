# async 的异步操作模式

我还记得以前执行异步操作需要在不断加深的回调地狱中使用回调的那些“好日子”。虽然回调地狱并没有完全成为过去，但是使用 Promise 来代替回调的嵌套已经很简单了。

我依稀记得 Promise 成为主流时的那些美好时光，我之前使用 jQuery 的 Deferred，后来 Promise 普及之后，我才在工作中把 Promise 库加到我们的项目中。那时我们已经有 Babel 了,所以我们甚至不需要再加一个 Promise 库。

无论如何，Promise在很大程度上实现了它们的承诺，使得异步编程更加易于管理。如果关于 Promise 的用法你还不是很熟，可以在[这里看到更多关于 Promise 的东西](https://www.telerik.com/blogs/what-is-the-point-of-promises)。当然，他们也有自己的弱点。很多时候，您要么需要嵌套 Promise ，要么需要将变量传递到外部，因为你需要的一些数据只在 Promise 的 handler 中可用。例如：

```javascript
function getVals () {
    return doSomethingAsync().then(function (val) {
        return doAnotherAsync(val).then(function (anotherVal) {
            // 这里我们需要val和anotherVal，所以我们嵌套了
            return val + anotherVal
        })
    })
}

// 或者...

function getVals () {
    let value

    return doSomethingAsync().then(function (val) {
        // 把 val 赋给最外面的 value，这样其他地方都能拿到了
        value = val
        return doAnotherAsync(val)
    }).then(function (anotherVal) {
        // 这里我们获取最外层的 value
        return value + anotherVal
    })
}
```

这两个例子本身都很混乱。当然，可以使用箭头函数使他们更有条理

```
function getVals () {
    return doSomethingAsync().then(val => doAnotherAsync(val).then(anotherVal => val + anotherVal))
}

// 或者...

function getVals () {
    let value

    return doSomethingAsync()
    .then(val => (value = val, doAnotherAsync(val)))
    .then(anotherVal => value + anotherVal)
}
```
上面的代码可能会清除一些语法上的问题，但是并不能带来更好的可读性。现在我们已经度过了那些“好日子”，现在我们有了 `async` 和 `await`，我们可以避免所有的那些废话。

```javascript
async function getVals () {
    let val = await doSomethingAsync()
    let anotherVal = await doAnotherAsync(val)

    return val + anotherVal
}
```

这看起来既简单，又容易理解。我假设你已经对 `async` 和 `await`很熟悉了，所以，我不打算介绍太多关于他们的细节。不过，你可以去 [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) 上复习更多的 `async/await`。在这里，我们将重点介绍过去在 Promises 中使用的模式，以及这些模式如何转换为 `async/await`。


## “随机”顺序异步操作

在前面的代码片段中，我们技术上已经讨论了一个模式——随机顺序操作——这是我们首先要讨论的。我说的随机，并不是真的随机。我指的是多个函数，它们可能彼此相关，也可能不相关，但它们是分别调用的。换句话说，随机操作与在整个输入列表/输入数组上执行的操作不同。如果你仍然感到困惑，你会在后面的章节中明白我说的意思，当我转到非随机操作时，你会看到区别。

总之，就像我说的，你已经用我们所说的第一个模式来实现了例子。这些操作是按顺序运行的，这意味着第二个操作要等到第一个操作完成后才能启动。这个模式可能与上面的示例不同，在使用承诺时，假设我们不会遇到前面的情况，即需要将多个值传递给后续操作：

```javascript
function getVals () {
    return doSomethingAsync()
    .then(val => doAnotherAsync(val))
    .then(anotherVal => /* 在这里，我们不需要val */ 2 * anotherVal)
}
```

无需在该最终的 handler 中访问 val ，因此我们只需链式调用 `then` 即可，而不必费心将值传递给外部作用域。但是酷炫的是，在 `async/await` 代码版本中，我们除了把最后表达式中的 `val +` 换成 `2 *`外，其他的什么都用改：

```javascript
async function getVals () {
    let val = await doSomethingAsync()
    let anotherVal = await doAnotherAsync(val)

    return 2 * anotherVal
}
```

这就是 `async/await` 擅长做的：把一个异步调用行为模拟成同步的，没有什么小把戏，只是简单的用“先做这个然后做那个”实现代码。

## “随机”并行异步操作

好了，这次我们看一下并行运行的操作，这些操作都不关心其他操作是否已经完成，也不依赖于其他操作产生的 value。当用 Promise 时，可以这样写(忽略这样一个事实:我重用了之前的异步函数名 getVals ，但是它们的使用方式完全不同;它们的函数名已经很明显表示它们是异步的;它们不一定是前面示例中使用的函数)：

```javascript
function getVals () {
    return Promise.all([doSomethingAsync(), doAnotherAsync()])
    .then(function ([val, anotherVal]) {
        return val + anotherVal
    })
}
```

我们使用 `Promise.all` 是因为它允许我们传递任意数量的 Promise，并且会一起执行完，通过一个 `then` 函数把所有结果返回给我们。还有其他选项，例如 `Promise.any`，`Promise.some` 等，究竟选哪个，这取决于你是否使用 Promise 库或某些 Babel 插件，当然还取决于你的用例以及你要如何处理输出或被拒绝的可能性。在任何情况下，模式都非常相似，你只需选择一个不同的 Promise 方法，就会得到不同的结果。
