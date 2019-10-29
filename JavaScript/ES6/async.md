# 【译】async 的异步操作模式

> 原文链接：https://careersjs.com/magazine/async-patterns/

> 原文作者：Joe Zimmerman

我还记得以前执行异步操作需要在越来越深的回调地狱中使用回调的那些“好日子”。虽然回调地狱并没有完全成为过去，但是使用 Promise 来代替回调的嵌套已经显得简单多了。

我依稀记得 Promise 成为主流时的那些美好时光，我之前使用 jQuery 的 Deferred，后来 Promise 普及之后，我才在工作中把 Promise 库加到我们的项目中。那时我们已经有 Babel 了,所以我们甚至不需要再加一个 Promise 库。

无论如何，Promise 在很大程度上实现了它的承诺，使得异步编程更加易于管理。如果关于 Promise 的用法你还不是很熟，可以在[这里看到更多关于 Promise 的知识](https://www.telerik.com/blogs/what-is-the-point-of-promises)。当然，Promise 也有自己的弱点。很多时候，您要么需要嵌套 Promise ，要么需要将变量传递到外部，因为你需要的一些数据只在 Promise 的 handler 中可用。例如：

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

```javascript
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
上面的代码可能会清除一些语法上的问题，但是并不能带来更好的可读性。好在我们已经度过了那些“好日子”，现在我们有了 `async` 和 `await`，我们可以避免所有的那些废话。

```javascript
async function getVals () {
    let val = await doSomethingAsync()
    let anotherVal = await doAnotherAsync(val)

    return val + anotherVal
}
```

这看起来既简单，又容易理解。我假设你已经对 `async` 和 `await`很熟悉了，所以，我不打算介绍太多关于他们的细节。不过，你可以去 [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) 上复习更多的 `async/await`。在这里，我们将重点介绍过去在 Promise 中使用的模式，以及这些模式如何转换为 `async/await`。


## “随机”顺序异步操作

在前面的代码片段中，我们在技术上已经讨论了一个模式——随机顺序操作——这是我们首先要讨论的。我说的随机，并不是真的随机。我指的是多个函数，它们可能彼此相关，也可能不相关，但它们是分别调用的。换句话说，随机操作与在整个输入列表/输入数组上执行的操作不同。如果你仍然感到困惑，你会在后面的章节中明白我说的意思，当我转到非随机操作时，你会看到区别。

总之，就像我说的，你已经用我们所说的第一个模式来实现了例子。这些操作是按顺序运行的，这意味着第二个操作要等到第一个操作完成后才能启动。这个模式可能与上面的示例不同，在使用 Promise 时，假设我们不会遇到前面的情况，即需要将多个值传递给后续操作：

```javascript
function getVals () {
    return doSomethingAsync()
    .then(val => doAnotherAsync(val))
    .then(anotherVal => /* 在这里，我们不需要val */ 2 * anotherVal)
}
```

跟最开始的 Promise 的例子相比，不需要在最终的 handler 中访问 val ，因此我们只需链式调用 `then` 即可，而不必费心将值传递给外部作用域。但是酷炫的是，在 `async/await` 代码版本中，我们除了把上面第一个 `async/await` 例子中，最后表达式的 `val +` 换成 `2 *`外，其他的什么都用改：

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

我们使用 `Promise.all` 是因为它允许我们传递任意数量的 Promise，并且会一起执行完，通过一个 `then` 函数把所有结果返回给我们。Promise 还有其他方法，例如 `Promise.any`，`Promise.some` 等，究竟选哪个，这取决于你是否使用 Promise 库或某些 Babel 插件，当然还取决于你的用例以及你要如何处理输出或被拒绝的可能（reject）。在任何情况下，模式都非常相似，你只需选择一个不同的 Promise 方法，就会得到不同的结果。

`async/await` 不允许我们脱离 `Promise.all` 或其组成部分来使用是把双刃剑。不好的是，`async/await` 在后台隐藏了对 Promise 的使用，但是我们需要显式地使用 Promise 才能并行执行操作。好的一面是，这意味着我们不用学习任何新东西，我们只要在以前使用的基础上删掉传递给 `then` 回调的额外参数就行。然后，我们使用 `await` 假装我们的并行操作都是瞬间完成。

```javascript
async function getVals () {
    let [val, anotherVal] = await Promise.all([doSomethingAsync(), doAnotherAsync()])
    return val + anotherVal
}
```
因此，`async/await` 不仅仅是删除回调和不必要的嵌套，更重要的是，它使异步编程模式看起来更像同步编程模式，这样代码对开发人员就会更友好。


## 迭代并行异步操作

这里的操作不是“随机”的了。在这里，我们对一组值进行迭代，并对每个值执行相同的异步操作。在这个并行版本中，每个元素都是同时处理的。

Promise 实现如下：

```javascript
function doAsyncToAll (values /* array */) {
    return Promise.all(values.map(doSomethingAsync))
}
```
就这么简单， 用 `async/await` 应该怎么做呢？其实你什么都不用做。非要做点什么的话，只会让代码更冗长。

```javascript
async function doAsyncToAll (values /* array */) {
    return await Promise.all(values.map(doSomethingAsync))
}
```

看上去除了添加几个假装使你看起来很聪明并使用现代 JavaScript 的关键字外，其他的毛用没有。但实际上，你添加这几个关键字没有任何价值，反而还会导致 JavaScript 引擎可能会运行得更慢。但是，如果你的代码更复杂一些， `async/await` 肯定可以提供一些好处：

```javascript
function doAsyncToAll (values /* array */) {
    return Promise.all(values.map(val => {
        return doSomethingAsync(val)
        .then(anotherVal => doAnotherAsync(anotherValue * 2))
    }))
}
```

虽然上面的代码看着也还行，但是 `async/await` 更简洁条理。

``` javascript
function doAsyncToAll (values /* array */) {
    return Promise.all(values.map(async val => {
        let anotherVal = await doSomethingAsync(val)
        return doAnotherAsync(anotherValue * 2)
    }))
}
```

就我个人而言，我认为这很清楚，至少从回调内部可以进行映射，但是这里有些人可能会感到困惑。当我第一次开始使用 `async/await` 时，我在回调中看到await，这让我认为这些回调没有并行触发。这是人们在嵌套函数中使用 `async/await` 时经常会犯的一个错误，并且是与直接使用 Promise 相比， `async/await` 显得可能不那么容易理解的实例。但是，当你使用嵌套异步函数时，稍微暴露一下可以帮助你更容易地发现问题，因此它们的内部函数与外部函数是分离的，并且 `await` 不会暂停外部函数。

紧接上文，一旦在你的函数中增加更多的步骤，阅读 Promise 的复杂度也会上升，使用 `async/await` 就会显得更有效果。

```javascript
function doAsyncToAll (values /* array */) {
    return Promise.all(values.map(val => {
        return doSomethingAsync(val)
        .then(anotherVal => doAnotherAsync(anotherValue * 2))
    }))
    .then(newValues => newValues.join(','))
}
```

这些不同层级的 `then` 调用真的会让一个人的头脑混乱，所以让我们用更现代的方式来实现它:

```javascript
async function doAsyncToAll (values /* array */) {
    const newValues = await Promise.all(values.map(async val => {
        let anotherVal = await doSomethingAsync(val)
        return doAnotherAsync(anotherValue * 2)
    }))
    return newValues.join(',')
}
```

以往来看，还有其他方法可以解决这种情况，但解决并不是最终目标：可读性和可维护性才是最重要的，通常这是 `async/await` 最方便的地方。编写通常也更简单，因为我们就是按照以前那种同步来写的。

## 迭代顺序异步操作

我们回到最后的模式。我们再次遍历一个列表，并对列表中的每项进行异步操作，但是这次，我们同一时间只执行一个操作。换句话说，在我们完成对第一项的操作之前，不能对第二项进行任何操作。

```javascript
function doAsyncToAllSequentially (values) {
    return values.reduce((previousOperation, val) => {
        return previousOperation.then(() => doSomethingAsync(val))
    }, Promise.resolve())
}
```

为了按照顺序执行，我们需要将 `then` 的调用链起来，前一个操作生成后一个操作。这可以通过reduce实现，也是最合理的方式。请注意，你需要传递一个 resolved 的 Promise 作为最后一个 reduce 的参数，这样第一次迭代就可以触发后面一连串的调用了。

在这里，我们将再次看到 `async/await` 耀眼的光芒，我们不需要像是 reduce 这样的任何数组方法，只需要一个普通的循环，然后在循环中使用 `await` 。

```javascript
async function doAsyncToAllSequentially (values) {
    for (let val of values) {
        await doSomethingAsync(val)
    }
}
```

如果你使用 reduce 的原因不仅仅是为了顺序操作，那么你仍然可以继续使用。例如，如果你打算把所有操作的结果相加

```javascript
function doAsyncToAllSequentially (values) {
    return values.reduce((previousOperation, val) => {
        return previousOperation.then(
            total => doSomethingAsync(val).then(
                newVal => total + newVal
            )
        )
    }, Promise.resolve(0))
}
```
上面的代码只会让我头脑混乱。令人惊讶的是，即使使用了 Promise ，我们也没有防止回调地狱的重现。即使我们使用了箭头函数，我们可以总是在一行内写完代码，但是这并没有让代码变得好理解。但是，使用 `async/await` 就可以让代码更简洁条理：

```javascript
async function doAsyncToAllSequentially (values) {
    let total = 0
    for (let val of values) {
        let newVal = await doSomethingAsync(val)
        total += newVal
    }
    return total
}
```

如果使用 `async/await` 时，你仍然喜欢在将数组单个值合并时使用 reduce ，那也可以参照下面的代码 ：

```javascript
async function doAsyncToAllSequentially (values) {
    return values.reduce(async (previous, val) => {
        let total = await previous
        let newVal = await doSomethingAsync(val)

        return total + newVal
    }, Promise.resolve(0))
}
```

## 总结

在编写异步代码时，相对较新的  `async/await` 关键字确实改变了编码体验。它们帮助我们消除或减弱了长期困扰 JavaScript 开发人员的异步代码编写和阅读方面的问题：回调地狱。让我们能够以一种更容易理解的方式读写异步代码。因此，了解如何有效地使用这项新技术是很重要的，我希望以上这些模式对你有所帮助。
