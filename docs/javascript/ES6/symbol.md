# Symbol 备忘

## 一些特性

- 除了 字符串型、数字型、布尔型、null 和 undefined 5 种原始类型外，ECMAScript 6 引入了第 6 种**原始类型**：Symbol。
- 所有原始值，除了 Symbol 以外都有各自的字面形式。
- 由于 Symbol 是原始值，因此调用 `new Symbol()` 会导致程序抛出错误
- Symbol 函数接受一个可选参数，其可以让你添加一段文本描述即将创建的 Symbol，这段描述不可用于属性访问，但是建议你在每次创建 Symbol 时都添加这样一段描述，以便于阅读代码和调试 Symbol 程序。
- Symbol 的描述被存储在内部的 `[[Description]]` 属性中，只有当调用 Symbol 的 `toString()` 方法时才可以读取这个属性。在执行 `console.log()` 时会隐式调用 `toString()` 方法，所以 Symbol 的描述会被打印到日志中，但不能直接在代码里访问 `[[Description]]`
- 不能将 Symbol 转换为字符串和数字类型，如果尝试将 Symbol 与一个字符串拼接，会导致程序抛出错误，将 Symbol 与每一个数学运算符混合使用都会导致程序抛出错误。
- 直接调用 `String()` 方法会得到跟 `console.log()` 相同的内容，因为 `String()` 方法会调用 Symbol 的 `toString()` 方法，返回字符串类型的 Symbol 描述里的内容。
- Symbol 可以用于逻辑操作符，因为 Symbol 与 JavaScript 中的非空值类似，其等价布尔值为 true
- `Object.getOwnPropertySymbols()` 是 ECMAScript 6 中添加的一个用来检索对象中的 Symbol 属性的方法。

## Symbol 的辨识方法

Symbol 是原始值，且 ECMAScript6 同时扩展了 typeof 操作符，支持返回 `"symbol"`，所以可以用 typeof 来检测变量是否为 Symbol 类型。

通过其他间接方式也可以检测变量是否为 Symbol 类型，但是 typeof 操作符是最准确也是最应首先的检测方式

```js
const symbol = Symbol('test symbol')
console.log(typeof symbol) // "symbol"
```

## Symbol 的用法

所有可以使用可计算属性名的地方，都可以使用 Symbol。

> 可计算属性名就是放在 中括号 `[]` 中的属性名

可以用在 对象单个属性设置、对象字面量可计算属性名、`Object.defineProperty()` 方法和 `Object.defineProperties()` 方法的调用过程中。

```js
'use strict'

let firstName = Symbol('first name')

let lastName = Symbol('last name')

// 用于对象字面量的可计算属性名
let person = {
  [firstName]: 'tom',
}
// 对象单个属性设置
person[lastName] = 'zaka'

// 将属性设置为只读
Object.defineProperty(person, firstName, { writable: false })

// 重写 Symbol 属性
Object.defineProperties(person, {
  [lastName]: {
    value: 'nio',
    writable: false,
  },
})
// person[lastName] = "aaa" // 严格模式，会报错
```

## Symbol 共享体系

有时候我们可能希望在不同的代码中共享同一个 Symbol，一般而言，在很大的代码库中或跨文件追踪 Symbol 非常困难而且容易出错，出于这些原因，ECMAScript 6 提供了一个可以随时访问的全局 Symbol 注册表。

如果想创建一个可共享的 Symbol，要使用 `symbol.for()`方法。它只接受一个参数，也就是即将创建的 Symbol 的字符串标识符，这个参数同样也被用于 Symbol 的描述。

```js
let uid = Symbol.for('uid')
let obj = {}
obj[uid] = '12345'
console.log(obj[uid]) // "12345"
console.log(uid) // "Symbol(uid)"

/**
 * Symbol.for() 方法首先会在全局 Symbol 注册表中搜索键为"uid"的 Symbol 是否存在，
 * 如果存在，直接返回已有的 Symbol；
 * 否则，创建一个新的 Symbol，并使用这个键在 Symbol 全局注册表中注册，随即返回新创建的 Symbol
 */

let uid2 = Symbol.for('uid') // 返回已有的 Symbol(uid)
console.log(uid === uid2) // true
```

还有一个与 Symbol 共享相关的特性：可以使用 `Symbol.keyFor()`方法在 Symbol 全局注册表中检索与 Symbol 有关的键。

```js
let uid = Symbol.for('uid')
console.log(Symbol.keyFor(uid)) // "uid"

let uid2 = Symbol.for('uid') // 返回已有的 Symbol(uid)
console.log(Symbol.keyFor(uid2)) // "uid"

let uid3 = Symbol('uid')
console.log(Symbol.keyFor(uid3)) // undefined
/**
 * Symbol 全局注册表中不存在 uid3 这个 Symbol，也就是不存在与之有关的键，所以最终返回 undefined
 */
```

> Symbol 全局注册表是一个类似全局作用域的共享环境，也就是说你不能假设目前环境中存在哪些键。当使用第三方组件时，尽量使用 Symbol 键的命名空间以减少命名冲突。例如，jQuery 的代码可以为所有键添加 “jquery” 前缀，就像 "jquery.element"或其他类似的键。
