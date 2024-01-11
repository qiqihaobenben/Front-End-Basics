# JavaScript 基础

## 诞生

JavaScript 诞生于 1995 年，有以下特征：

- 借鉴了 C 语言的基本语法
- 借鉴了 Java 语言的数据类型和内存管理
- 借鉴 Scheme 语言，将函数提升到“第一等公民”（first class）的地位
- 借鉴 Self 语言，使用基于原型（prototype）的继承机制

## 发展

- 1995.9，LiveScript
- 1995.12，JavaScript
- 1997.6，第一版 ECMAScript 发布
- 1999.12，第三版 ECMAScript 发布
- 2009.12，第五版 ECMAScript 发布
- 2009 年，Ryan 创建了 Node.js
- 2010 年，Isaac 基于 Node.js 写出了 NPM
- 2015.6，第六版 ECMAScript 发布，简称 ES6，之后每年发布一个新的版本，统称为 ESNext。

## 特点

JavaScript 是单线程的，动态的弱类型的解释类语言，编程范式同时支持命令式（例如：面相对象）和声明式（例如函数式编程）

JavaScript 是单线程，但是浏览器是多进程的，每个 Tab 页签就是一个渲染进程，渲染进程下又包含 GUI 线程和 JS 线程，此处的 JS 线程才是 JavaScript 运行的地方，所以才说 JavaScript 是单线程的。

- GUI 线程，也称为渲染线程，例如渲染引擎 Blink 就运行在这个线程，用来解析 HTML 结构和 CSS 样式，渲染页面的。
- JS 线程，例如 JS 引擎 V8 就运行在这个线程，用来解释和执行 JavaScript 代码。

GUI 线程跟 JS 线程是互斥的，JavaScript 代码是可以改变页面的 DOM 的，此时如果 GUI 线程在解析渲染的同时 JavaScript 修改了页面元素的位置，此时页面上展示出来的可能就不是最新的。所以 GUI 线程渲染的时候，JS 线程是停顿的，JS 线程在执行的时候，GUI 线程就是停顿的。
