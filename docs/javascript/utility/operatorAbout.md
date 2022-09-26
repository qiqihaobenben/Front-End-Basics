# JavaScript 运算符相关拾遗

## 运算符优先级

运算符的优先级决定了表达式中运算执行的先后顺序，优先级高的运算符会作为优先级低的运算符的操作数。

```js
console.log(4 * 3 ** 2) // 4 * 9

let a, b
console.log((a = b = 5)) // 5
```

### 优先级和结合性

```
a OP1 b OP2 c
```

如果 OP1 和 OP2 具有不同的优先级，则优先级最高的运算符先执行，不用考虑结合性。

```js
console.log(3 + 10 * 2) // 相当于 console.log(3 + (10 * 2)) 输出 23

console.log((3 + 10) * 2) // 括号 () 的优先级最高，改变了优先级，输出 26
```

仅使用一个或多个不同优先级的运算符时，结合性不会影响输出，当有多个具有相同优先级的运算符时，结合性的差异就会发挥作用。

左结合（左到右）相当于把左边的子表达式加上小括号 `(a OP b) OP c`，右结合（右到左）相当于 `a OP (b OP c)`。赋值运算符是右结合的，例如：

```
a = b = 5 相当于 a = (b = 5)
```

另一个例子是，只有幂运算符（`**`）是右结合的，而其他算术运算符都是左结合的。有趣的是，无论结合性和优先级如何，求值顺序总是从左到右。

**要注意一元运算符的关联顺序。当有多个一元运算符连接时，从右向左执行。** 例如 new、！、typeof 等。

### 分组和短路

**分组（Grouping）**具有最高优先级。然而，这并不意味着总是优先对分组符号`(...)`内的表达式进行求职，尤其是设计短路时。

短路是条件求值的术语，例如，在表达式 `a && (b + c)` 中，如果 `a` 为假（[falsy](https://developer.mozilla.org/zh-CN/docs/Glossary/Falsy)），那么及时 `(b + c)` 在圆括号中，也不会被求值，这时我们可以说逻辑与运算符（AND）是“短路的”。除此之外，其他的短路运算符还包括 逻辑或（OR）、空值合并、可选链和三元运算符。

```
a || (b * c) // 首先对 a 求值，如果 a 为真值则直接返回 a
a && (b < c) // 首先对 a 求值，如果 a 为假值则直接返回 a
a ?? (b || c) // 首先对 a 求值，如果 a 不是 null 或 undefined 则直接返回 a
a?.b.c // 首先对 a 求职，如果 a 是 null 或 undefined 则直接返回 undefined
```

### [运算符优先级汇总表](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#%E6%B1%87%E6%80%BB%E8%A1%A8)

### 一些判断优先级的例子

```js
3 > 2 > 1
// 返回 false，因为 3 > 2 是 true，然后 true 会在比较运算符中
// 被隐式转换为 1，因此 true > 1 会变为 1 > 1，结果是 false
// 加括号可以更清楚：(3 > 2) > 1
```

```js
function Foo() {
  getName = function () {
    console.log(1)
  }
  return this
}
Foo.getName = function () {
  console.log(2)
}
Foo.prototype.getName = function () {
  console.log(3)
}
var getName = function () {
  console.log(4)
}

new Foo.getName() // 2
new Foo().getName() //3
new new Foo().getName() //3
```

#### new (带参数列表)、new (无参数列表)与点运算符的优先级

- new (带参数列表) 和成员访问（点运算符）的优先级是一样的（都是 18），优先级一样的情况下，表达式从左向右运算，就好像加和减的优先级一样，计算时从左向右算。因此出现 `new Foo().getName()` 这样的表达式时，从左向右，先计算 `new Foo()`, 再计算 `**.getName`，相当于`(new Foo()).getName()`。就像 3+2-1，就相当于(3+2)-1，我们知道这里的括号可以省略，是因为熟悉这样的运算顺序。

> 带参数列表不一定要有实参，带了括号就表示能带参数的表达式，new Foo()和 new Foo(10)是一样的表达式，前者的参数为 0 个而已。

- new (无参数列表)的优先级是 17，成员访问（点运算符）的优先级是 18，点运算符优先级更高，所以 `new Foo.getName()` 先计算优先级更高的，也就是计算 `Foo.getName`，再计算 `new **`。

## 位运算符

## 运算符导致的数据类型隐式转换

## 数值精度问题

## == 和 ===

有些判断不了的比如 NAN 等

// TODO
