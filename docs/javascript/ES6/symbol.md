# Symbol 备忘

## 一些特性

- 除了 字符串型、数字型、布尔型、null 和 undefined 5 种原始类型外，ECMAScript 6 引入了第 6 种**原始类型**：Symbol。
- 所有原始值，除了 Symbol 以外都有各自的字面形式。
- 由于 Symbol 是原始值，因此调用 `new Symbol()` 会导致程序抛出错误
- Symbol 函数接受一个可选参数，其可以让你添加一段文本描述即将创建的 Symbol，这段描述不可用于属性访问，但是建议你在每次创建 Symbol 时都添加这样一段描述，以便于阅读代码和调试 Symbol 程序。
- Symbol 的描述被存储在内部的 `[[Description]]` 属性中，只有当调用 Symbol 的 `toString()` 方法时才可以读取这个属性。在执行 `console.log()` 时会隐式调用 `toString()` 方法，所以 Symbol 的描述会被打印到日志中，但不能直接在代码里访问 `[[Description]]`

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
