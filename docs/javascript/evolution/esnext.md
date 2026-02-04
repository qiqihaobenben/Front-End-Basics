# ES2015 ～ ES2025 新特性

## ES2015 (ES6) - 一个巨大的更新

- let 和 const​​：块级作用域的变量声明。
- 箭头函数 ​​：`() => {}` 语法，更简洁的函数表达式，并且不绑定 this。
- 模板字符串 ​​：使用反引号和 `${}` 插入变量。
- 增强的对象字面量 ​​：包括方法简写、计算属性名等。
- 解构赋值 ​​：从数组或对象中提取值并赋值给变量。
- 默认参数 ​​：函数参数可以设置默认值。
- 剩余参数和扩展运算符 ​​：... 操作符，用于函数参数和数组/对象操作。
- 类语法 ​​：class 关键字，提供更清晰的面向对象编程语法（本质是语法糖）。
- 模块化 ​​：import 和 export 关键字，支持模块化编程。
- Promise​​：提供异步编程的解决方案。
- Symbol​​：新的原始数据类型，用于创建唯一的标识符。
- Set 和 Map 数据结构 ​​：提供新的集合类型。
- 迭代器和 for...of 循环 ​​：提供统一的迭代接口和循环语法。

## ES2016 (ES7)

- ​Array.prototype.includes​​：检查数组是否包含某元素。
- ​​ 指数运算符 ​​：**，如 2 ** 3 等于 8。

## ES2017 (ES8)

- ​​Async/Await​​：基于 Promise 的异步编程语法糖，使异步代码更易读。
- ​​Object.values()和 Object.entries()​​：获取对象的值数组和键值对数组。
- ​​ 字符串填充 ​​：padStart()和 padEnd()。
- ​​Object.getOwnPropertyDescriptors()​​：获取对象所有属性的描述符。
- ​​ 共享内存和 Atomics​​（Shared Memory and Atomics）：用于多线程编程，属于高级功能。

## ES2018 (ES9)

- ​​ 异步迭代 ​​：for await...of 循环。
- ​​Rest/Spread 属性 ​​：对象也可以使用剩余参数和扩展运算符。
- ​​Promise.prototype.finally()​​：在 Promise 链后无论成功失败都执行的函数。
- ​​ 正则表达式的改进 ​​：包括命名捕获组、后行断言、dotAll 模式等。

## ES2019 (ES10)

- ​​Array.prototype.flat() / flatMap()​​：数组扁平化。
- ​​Object.fromEntries()​​：将键值对列表（如 Map）转换为对象。
- ​​ 字符串的 trimStart()和 trimEnd()​​：去除字符串首尾空格。
- ​​Symbol.prototype.description​​：获取 Symbol 的描述。
- ​​ 可选的 catch 绑定 ​​：可以省略 catch 中的参数，如

## ES2020 (ES11)

- ​​ 可选链操作符 ​​：?.，避免访问深层属性时出错。
- ​​ 空值合并操作符 ​​：??，提供默认值，只有为 null 或 undefined 时才使用默认值。
- ​​ 全局对象 globalThis​​：在任意环境访问全局对象。
- ​​BigInt​​：支持大整数。
- ​​ 动态导入 ​​：import()函数，动态导入模块。
- ​​Promise.allSettled()​​：返回一个在所有给定的 promise 都已经 fulfilled 或 rejected 后的 promise。

## ES2021 (ES12)

- String.prototype.replaceAll()​​：替换字符串中所有匹配项。
- 逻辑赋值运算符 ​​：&&=，||=，??=。
- ​​Promise.any()​​：接受一个 Promise 可迭代对象，只要有一个成功就返回，如果全部失败则返回 AggregateError。
- ​​WeakRef​​：创建对对象的弱引用，不会阻止垃圾回收。
- ​​ 数字分隔符 ​​：1_000_000 使大数字更易读。

## ES2022 (ES13)

- ​​ 类字段声明 ​​：可以在类顶层定义实例字段，无需在构造函数中定义。
- ​​ 私有类成员 ​​：在类中通过#前缀定义私有方法和属性。
- ​​ 静态类成员 ​​：包括静态块（static block），在类内部提供静态成员的初始化代码。
- ​​Top-level Await​​：在模块的顶层使用 await，不必在 async 函数内。
- ​​Error 对象的 cause 属性 ​​：在错误对象中传递导致该错误的根本原因。
- ​​ 数组和字符串的.at()方法 ​​：允许按索引访问元素（支持负数索引）。
- ​​Object.hasOwn()​​：替代 Object.prototype.hasOwnProperty.call，检查对象是否具有某个属性。

## ES2023 (ES14) - 已正式发布

- ​​ 数组查找方法增加 findLast 和 findLastIndex​​：从数组末尾开始查找。
- ​​Hashbang 语法标准化 ​​：在 Node.js 中已经支持，如#!/usr/bin/env node。
- ​​ 通过拷贝改变数组的方法 ​​：toSorted, toReversed, toSpliced, with（这些方法返回一个新数组，不改变原数组）。

## ES2024 (ES15) - 预计 2024 年发布，但已有一些 Stage 4 特性

- ​​Record 和 Tuple​​：新的不可变数据结构（目前 Stage 2，但可能成为重点）。
  注意：截至 2023 年底，Record 和 Tuple 尚未进入 Stage 4，因此可能不会在 2024 年发布。所以这里暂时不列。
  目前进入 Stage 4 的 ES2024 特性：

- ​​Array.fromAsync​​：从异步可迭代对象创建数组。
- ​​String.prototype.isWellFormed 和 String.prototype.toWellFormed​​：检查字符串是否为 UTF-16 格式正确的字符串，并转换。
- ​​RegExp v flag​​：提供更强大的 Unicode 支持。

同时，还有一些其他的提案可能进入：

- ​​Temporal​​：更好的日期时间处理（目前 Stage 3）。

## ES2025 (ES16) - 还早，但可以列出一些 Stage 3 的提案

由于 ES2025 的特性尚未完全确定，我们可以列出一些已经进入 Stage 3 并且有可能加入 ES2025 的特性（但是否最终加入还要看进度）：

- ​​ 管道操作符 (Pipeline Operator)​​：|>，用于函数调用链，使链式操作更易读。
- ​​ 模式匹配 (Pattern Matching)​​：类似其他语言中的 match 表达式，增强的条件分支处理。
- ​​ 类装饰器 (Decorators)​​：用于修改类或其成员的行为（目前 Stage 3）。
- ​​ 记录类型 (Records) 和元组类型 (Tuples)​​：如果之前没加入，可能在这一版。

注意：以上对于 ES2024 和 ES2025 的预测是基于当前（2023 年底）的提案状态，实际情况可能会有变化。
