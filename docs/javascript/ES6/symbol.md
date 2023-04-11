# Symbol 备忘

## 一些特性

- 除了 字符串型、数字型、布尔型、null 和 undefined 5 种原始类型外，ECMAScript 6 引入了第 6 种**原始类型**：Symbol。
- 所有原始值，除了 Symbol 以外都有各自的字面形式。
- 由于 Symbol 是原始值，为了避免创建原始值包装对象，因此调用 `new Symbol()` 会导致程序抛出错误
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

## 奇异对象——通过 well-known Symbol 暴露内部操作

ECMAScript 5 的一个中心主旨是将 JavaScript 中的一些“神奇”的部分暴露出来，并详尽定义了这些开发者们在当时模拟不了的功能。ECMAScript 6 延续了这个传统，新标准中主要通过在原型链上定义与 Symbol 相关的属性来暴露更多的语言内部逻辑。

ECMAScript 6 开放了以前 JavaScript 中常见的内部操作，并通过预定义一些 well-known Symbol 来表示。

重写一个由 well-known Symbol 定义的方法，会导致对象内部的默认行为被改变，从而一个普通对象会变为一个奇异对象（exotic object）。但实际上其不会对你的代码产生任何影响，只是在规范中描述对象的方式改变了。

### Symbol.hasInstance 方法

一个在执行 `instanceof` 时调用的内部方法，用于检测对象的继承信息。

每一个函数中都有一个 `Symbol.hasInstance` 方法，用于确定对象是否为函数的实例。该方法在 `Function.prototype` 中定义，所以所有函数都继承了 instanceof 属性的默认行为。为了确保 `Symbol.hasInstance` 不会被**意外重写**，该方法被定义为不可写、不可配置并且不可枚举。

`Symbol.hasInstance` 方法只接受一个参数，即要检查的值。如果传入的值是函数的实例，则返回 true。

> 因为 instanceof 左操作数必须是一个对象，所以传入的参数也必须是对象，如果左操作数为非对象，会导致 instanceof 总是返回 false。

```js
let arr = []

console.log(arr instanceof Array) // true
// 上下两者等价
console.log(Array[Symbol.hasInstance](arr)) // true
```

本质上，ECMAScript 6 只是将 `instanceof` 操作符重新定义为 `Symbol.hasInstance` 方法的简单语法。现在引入方法调用后，就可以随意改变 instanceof 的运行方式了。

例如：

```js
let arr = []
/**
 * 这样写会报错，Symbol.hasInstance 是只读的
  Array[Symbol.hasInstance] = function(v) {
    return false
  }
*/
// 只有通过 Object.defineProperty() 方法才能够改写一个不可写属性
Object.defineProperty(Array, Symbol.hasInstance, {
  value: function (v) {
    return false
  },
})
console.log(Array[Symbol.hasInstance](arr)) // false
```

## Symbol.isConcatSpreadable 属性

一个布尔值，用于表示当传递一个集合作为 `Array.prototype.concat()` 方法的参数时，是否应该将集合内的元素规整到同一层级。

JavaScript 规范声明，`concat` 凡是传入了数组参数，就会自动将它们分解为独立元素。在 ECMAScript 6 标准以前，我们根本无法调整这个特性。

`Symbol.isConcatSpreadable` 属性是一个布尔值，如果该属性值为 true，则表示对象有 length 属性和数字键，故它的数值型属性值应该被独立添加到 `concat()` 调用的结果中。

```js
let arr = ['Hi']

let collection = {
  0: 'Hello',
  1: 'world',
  length: 2,
  [Symbol.isConcatSpreadable]: true,
}

let messages = arr.concat(collection)
console.log(messages.length) // 3
console.log(messages) // ["Hi", "Hello", "world"]
```

> 也可以在派生数组子类中将 Symbol.isConcatSpreadable 设置为 false，从而防止元素在调用 concat() 方法时被分解。

## 字符串相关的四个属性

### Symbol.match 属性

一个在调用 `String.prototype.replace()` 方法时调用的方法，用于比较字符串

### Symbol.replace 属性

一个在调用 `String.prototype.replace()` 方法时调用的方法，用于替换字符串的子串

### Symbol.search 属性

一个在调用 `String.prototype.search()` 方法时调用的方法，用于在字符串中定位子串。

### Symbol.split 属性

一个在调用 `String.prototype.split()` 方法时调用的方法，用于分割字符串。

在 ECMAScript 6 之前，`match(regex)`、`replace(regex, replacement)`、`search(regex)`、`split(regex)` 4 个方法无法使用开发者自定义的对象来替代正则表达式进行字符串匹配，而在 ECMAScript6 中，定义了对应的以上 4 个 Symbol 属性，将语言内建的 RegExp 对象的原生特性完全外包出来。

`Symbol.match`、`Symbol.replace`、`Symbol.search` 和 `Symbol.split` 这 4 个 Symbol 属性表示 `match(regex)`、`replace(regex, replacement)`、`search(regex)`、`split(regex)` 方法的第一个参数应该调用的正则表达式参数的方法，它们被定义在 `RegExp.prototype` 中，是字符串方法应该使用的默认实现。

了解上面的原理后，即使不使用正则表达式和以正则表达式为参的方法也可以在对象中实现模式匹配：

```js
// 这个对象实际上等价于 /^.{10}$/
let hasLengthOf10 = {
  [Symbol.match]: function (value) {
    return value.length === 10 ? [value] : null
  },
  [Symbol.replace]: function (value, replacement) {
    return value.length === 10 ? replacement : value
  },
  [Symbol.search]: function (value) {
    return value.length === 10 ? 0 : -1
  },
  [Symbol.split]: function (value) {
    return value.length === 10 ? ['', ''] : [value]
  },
}

let message1 = 'Hello world' // length 为 11
let message2 = 'Hello haha' // length 为 10

console.log(message1.match(hasLengthOf10)) // null
console.log(message2.match(hasLengthOf10)) // [ "Hello haha" ]

console.log(message1.replace(hasLengthOf10, 'yes')) // "Hello world"
console.log(message2.replace(hasLengthOf10, 'yes')) // "yes"

console.log(message1.search(hasLengthOf10)) // -1
console.log(message2.search(hasLengthOf10)) // 0

console.log(message1.split(hasLengthOf10)) // ["Hello world"]
console.log(message2.split(hasLengthOf10)) // ["",""]
```

虽然上面的例子很简单，但由于能够执行比现有正则表达式更复杂的匹配，因而让自定义模式匹配变得更加可行。

## Symbol.toPrimitive 方法

一个返回对象原始值的方法。

在 JavaScript 引擎中，当执行特定操作时，经常会尝试将对象转换到相应的原始值，例如，使用双等号（==）运算符比较一个字符串和一个对象，对象会在比较操作执行前被转换为一个原始值。到底使用哪一个原始值以前是由内部操作决定的，但在 ECMAScript 6 的标准中，通过 `Symbol.toPrimitive` 方法可以更改那个暴露出来的值。

`Symbol.toPrimitive` 方法被定义在每一个标准类型的原型上，并且规定了当对象被转换为原始值时应当执行的操作。每当执行原始值转换时，总会调用 `Symbol.toPrimitive` 方法并传入一个值作为参数，这个值在规范中被称作类型提示（hint）。类型提示参数的值只有三种选择：`"number"`、`"string"`、`"default"`，传递这些参数时，Symbol.toPrimitive 返回的分别是：数字、字符串或无类型偏好的值。

大多数标准对象，数字模式有以下特性，根据优先级的顺序排序如下（默认模式类似）：

1. 调用 `valueOf()` 方法，如果结果为原始值，则返回。
2. 否则，调用 `toString()` 方法，如果结果为原始值，则返回。
3. 如果再无可选值，则抛出错误。

大多数标准对象，字符串模式有以下优先级排序：

1. 调用 `toString()` 方法，如果结果为原始值，则返回
2. 否则，调用 `valueOf()` 方法，如果结果为原始值，则返回
3. 如果再无可选值，则抛出错误。

具体可以看一下：[对象 — 原始值转换](https://juejin.cn/post/7021785804942868510)

> 在大多数情况下，标准对象会将默认模式按数字模式处理（除了 Date 对象，在这种情况下，会将默认模式按字符串模式处理）。例如 `Number()`、减号 `-`、除号 `/`、大于 `>`、小于 `<`。其他的例如 `alert()` 和 `String()` 会使用字符串模式。

> 默认模式只用于 `==` 运算、`+` 运算及给 Date 构造函数传递一个参数时。在大多数的操作中，使用的都是数字模式或字符串模式。

如果自定义 `Symbol.toPrimitive` 方法，则可以覆盖这些默认的强制转换特性。

```js
function Temperature(degrees) {
  this.degrees = degrees
}

Temperature.prototype[Symbol.toPrimitive] = function (hint) {
  switch (hint) {
    case 'string':
      return this.degrees + '\u00b0'
    case 'number':
      return this.degrees
    case 'default':
      return this.degrees + ' degrees'
  }
}

let freezing = new Temperature(32)

console.log(freezing + '!') // 默认模式 32 degrees!
console.log(freezing / 2) // 数字模式 16
console.log(String(freezing)) // 字符串模式 32°
```

## Symbol.toStringTag 属性

一个在调用 `Object.prototype.toString()` 方法时使用的字符串，用于创建对象描述。

### 先说一个问题

JavaScript 中有时会同时存在多个全局执行环境，比如在 Web 浏览器中，如果一个页面包含 `iframe` 标签，就会分别为页面和 `iframe` 内嵌页面生成两个全局执行环境。在大多数情况下，由于数据可以在不同环境间来回传递，不太需要担心；但是如果对象在不同环境间传递之后，想确认它的类型就有麻烦了。

典型的案例是从 `iframe` 想页面中传递一个数组，或者执行反向操作。而在 ECMAScript 6 的术语中，`iframe` 和它的外围页面分别代表不同的领域（realm），而领域指的则是 JavaScript 的执行环境。所以每一个领域都有自己的全局作用域，有自己的全局对象，在任何领域中创建的数组，都是一个正规的数组。然后，如果将这个数组传递到另一个领域中，`instanceof Array` 语句的检测结果会返回 false，此时 `Array` 已是另外一个领域的构造函数，显然被检测的数组不是由这个构造函数创建的。（可以参考：[instanceof 和多全局对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof#instanceof_%E5%92%8C%E5%A4%9A%E5%85%A8%E5%B1%80%E5%AF%B9%E8%B1%A1_%E4%BE%8B%E5%A6%82%EF%BC%9A%E5%A4%9A%E4%B8%AA_frame_%E6%88%96%E5%A4%9A%E4%B8%AA_window_%E4%B9%8B%E9%97%B4%E7%9A%84%E4%BA%A4%E4%BA%92)）

### 针对类型识别问题的解决方案

调用 Object.prototype.toString 方法每次都会返回预期的字符串，能解决上面数组类型识别问题。因为在返回的结果中，引入了一个内部定义的名称 `[[Class]]`。开发者们可以通过这个方法来确定在当前 JavaScript 环境中该对象的数据类型是什么。

### 在 ECMAScript 6 中定义对象字符串标签

ECMAScript 6 重新定义了原生对象过去的状态，通过 `Symbol.toStringTag` 这个 Symbol 改变了调用 `Object.prototype.toString()` 时返回的身份标识。（之前是无法改变的）

这个 Symbol 所代表的属性在每一个对象中都存在，其定义了调用对象的 `Object.prototype.toString.call()` 方法时返回的值。对于数组，调用后返回的值通常是`"[object Array]"`，它正是存储在对象的 `Symbol.toStringTag` 属性中。

> 除非另有说明，所有对象都会从 `Object.prototype` 继承 `Symbol.toStringTag` 这个属性，且默认的属性值为 `"[object Object]"`

```js
function Person(name) {
  this.name = name
}

Person.prototype[Symbol.toStringTag] = 'Person'

let me = new Person('Tom')
console.log(me.toString()) // "[object Person]"
console.log(Object.prototype.toString.call(me)) // "[object Person]"

Person.prototype.toString = function () {
  return this.name
}
let me1 = new Person('Tom')
console.log(me1.toString()) // Tom
console.log(Object.prototype.toString.call(me1)) // "[object Person]"

Person.prototype[Symbol.toStringTag] = 'Array'
let me2 = new Person('Tom')
console.log(me2.toString()) // Tom
console.log(Object.prototype.toString.call(me2)) // "[object Array]"
```

同样可以修改原生对象的字符串标签，只需要修改对象原型上的 `Symbol.toStringTag` 属性的值即可：`Array.prototype[Symbol.toStringTag] = "Magic"` ，语言本身不会禁止这样做，当时强烈反对用这种方法修改内建对象。

## Symbol.unscopables 属性

一个定义了一些不可被 with 语句引用的对象属性名称的对象集合。

`Symbol.unscopables` 这个 Symbol 通常用于 `Array.prototype`，以在 with 语句中标示出不创建绑定的属性名。`Symbol.unscopables` 是以对象的形式出现的，它的键是 `with` 语句中要忽略的标识符，其对应的值必须是 `true`。

数组 Symbol.unscopables 属性的默认值：

```js
// 已默认内置到 ECMAScript 6 中
Array.prototype[Symbol.unscopables] = Object.assgin(Object.create(null), {
  copyWithin: true,
  entries: true,
  fill: true,
  find: true,
  findIndex: true,
  keys: true,
  values: true,
})
```

尽管未来的代码无疑将不会使用 with 语句，但是 ECMAScript 6 仍然在非严格模式下提供了向后兼容，在 with 语句中不在创建这些方法的绑定，从而支持老代码继续运行，程序不在抛出错误。

总之不要为自己创建的对象定义 `Symbol.unscopables` 属性，除非在代码中使用了 with 语句并且正在修改代码库中已有的对象。

### 为什么不再使用 with 语句？

with 语句是 JavaScript 中最有争议的一个语句，设计它的初衷是可以免于编写重复的代码。但由于加入 with 语句后，代码变得难以理解，它的执行性能很差且容易导致程序出错，因此被大多数开发者所诟病。

最终，标准规定，在严格模式下不可以使用 with 语句；且这条限制同样影响到了类和模块，默认使用严格模式且没有任何退出的方法。
