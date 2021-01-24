<!--
 * @Author: chenfangxu
 * @Date: 2021-01-24 15:04:23
 * @Description: JavaScript的执行原理
 * @LastEditors: chenfangxu
 * @LastEditTime: 2021-01-25 07:14:34
 * @FilePath: /front/JavaScript/utility/javascript-runing.md
-->

# JavaScript 的执行原理

## 词法环境和变量作用域

### 使用词法环境跟踪变量的作用域

词法环境（lexical environment）是 JavaScript 引擎内部用来跟踪标识符和特定变量之间的映射关系。

**词法环境是 JavaScript 作用域的内部实现机制，人们通常称为作用域（scopes）。**

通常来说，词法环境与特定的 JavaScript 代码结构关联，既可以是一个函数、一段代码片段，也可以是 try-catch 语句。这些代码结构（函数、代码片段、try-catch）可以具有独立的标识符映射表。

#### 代码嵌套

词法环境主要基于代码嵌套，通过代码嵌套可以实现代码结构包含另一代码结构。

在作用域范围内，每次执行代码时，代码结构都获得与之关联的词法环境。例如，每次调用一个函数，都将创建新的函数词法环境。

内部代码结构可以访问外部代码结构中定义的变量。这种访问变量的方式我们已经习以为常了，但是 JavaScript 引擎是如何跟踪这些变量的呢？如何判断可访问性的呢？这就是词法环境的作用。

#### 代码嵌套与词法环境

有代码嵌套时，除了跟踪局部变量、函数声明、函数的参数和词法环境外，还有必要跟踪外部（父级）的词法环境。因为我们需要访问外部代码结构中的变量，如果在当前环境中无法找到某一标识符，就会对外部环境进行查找。一旦查找到匹配的变量，或是在全局环境中仍然无法查找到对应的标识符而返回错误，就会停止查找。

##### 为什么不直接跟踪整个执行上下文

为什么不直接跟踪整个执行上下文，直接搜索与环境相匹配的标识符映射表呢？因为 JavaScript 函数可以作为任意对象进行传递，定义函数时的环境与调用函数时的环境往往是不同的。（例如闭包的某些场景）

#### 函数与词法环境

无论何时调用函数，都会创建一个新的执行上下文，被推入执行上下文栈，每个执行上下文都有一个与之关联的词法环境，词法环境中包含了在上下文中定义的标识符的映射表。

此外被调用的函数在一开始创建的时候，同时还会创建一个与之相关联的外部词法环境（只要至少有一个通过闭包访问外部环境变量的函数存在，这个环境就会一直保存），并存储在名为 `[[Environment]]` 的内部属性上（内部属性无法直接访问或操作）。两个中括号用于标志内部属性。最重要的是：外部环境与新建的词法环境之间的关系，JavaScript 引擎将调用函数内置 `[[Environment]] `属性与创建函数时的外部环境进行关联。

#### 扩展

在 JavaScript 的 ES6 初版中，词法环境只能与函数关联。变量只存在于函数作用域中。这带来了一些混淆，因为 JavaScript 是一门类 C 的语言，从其他类 C 语言（C++、C#、Java 等）转向 JavaScript 的开发者通常会预期一些初级概念，例如块级作用域。在 ES6 中最终修复了块级作用域问题。

## 脚本和函数执行

### 执行上下文

JavaScript 中与闭包“环境部分”相对应的属于是“词法环境”，但是 JavaScript 函数比 λ 函数要复杂的多，还要处理 this，变量声明、with 等等一系列的复杂语法，所以在 JavaScript 的设计中，词法环境只是 JavaScript 执行上下文的一部分。

JavaScript 标准把一段代码（包括函数），执行所需的所有信息定义为：“执行上下文”。

执行上下文在 ES3 中，包含三个部分：

- scope：作用域，也常常被叫做作用域链。
- variable object：变量对象，用于存储变量的对象
- this value：this 值。

在 ES5 中，改进了命名方式：

- lexical environment：词法环境，当获取变量时使用。
- variable environment： 变量环境，当声明变量时使用。
- this value：this 值

在 ES2018 中，执行上下文又变成了下面这个样子，this 值被归入 lexical environment

- lexical environment：词法环境，当获取变量或者 this 值时使用。
- variable environment：变量环境，当生命变量时使用。
- code evaluation state：用于恢复代码执行位置。
- Function：执行的任务是函数时使用，表示正在被执行的函数。
- ScriptOrModule: 执行的任务是脚本或者模块时使用，表示正在被执行的代码。
- Realm：使用的基础库和内置对象实例。
- Generator：仅生成器上下文有这个属性，表示当前生成器。

建议同意使用最新的 ES2018 中规定的术语定义。

#### Realm

在最新的标准（9.0）中，JavaScript 引入了一个新概念 Realm。Realm 中包含一组完整的内置对象，而且是复制关系。

对不同 Realm 中的对象操作，会有一些需要格外注意的问题，比如 instanceOf 几乎是失效的。

以下代码展示了在浏览器环境中获取来自两个 Realm 的对象，它们跟本土的 Object 做 instanceOf 时会产生差异。

```

var iframe = document.createElement('iframe')
document.documentElement.appendChild(iframe)
iframe.src="javascript:var b = {};"

var b1 = iframe.contentWindow.b;
var b2 = {};

console.log(typeof b1, typeof b2); //object object

console.log(b1 instanceof Object, b2 instanceof Object); //false true
```

可以看到，由于 b1、b2 由同样的代码“{}”在不同的 Realm 中执行，所以表现出了不同的行为。

### JavaScript 基于单线程的执行模型

在 JavaScript 中，代码执行的基础单元是函数。JavaScript 代码有两种类型：一种是全局代码（包括脚本、模块），在所有函数外部定义；一种是函数代码，位于函数内部。

**JavaScript 引擎执行代码时，每一条语句都处于特定的执行上下文（execution context）中** 。既然具有两种类型的代码，那么就有两种执行上下文：全局执行上下文和函数执行上下文。二者最重要的差别是：全局执行上下文只有一个，当 JavaScript 程序开始执行时就已经创建了全局上下文；而函数执行上下文是在每次调用函数时，就会创建一个新的。（ES3 中每个执行上下文都有一个表示变量的对象——变量对象。全局环境的变量对象（global object）始终存在，而函数这样的局部环境的变量对象（variable object），只在函数执行的过程中存在（activation object）。调用函数时，会创建一个预先包含全局变量对象的作用域链，这个作用域链被保存在内部的[[Scope]]属性中，当调用函数是，会创建一个执行环境，然后通过复制函数的[[Scope]]属性中的对象构建起执行环境的作用域链）

在某个特定的时刻只能执行特定的代码。一旦发生函数调用，当前的执行上下文必须停止执行，并创建新的函数执行上下文来执行函数。当函数执行完成后，将函数执行上下文销毁，并重新回到发生调用时的执行上下文中（以上所说的过程也称为“切换上下文”）。所以需要跟踪执行上下文——正在执行的上下文以及正在等待的上下文。最简单的跟踪方法是使用执行上下文栈（execution context stack）或称为调用栈（call stack）

例如：

```
function skulk(ninja) {
  report(ninja + " skulking");
}
function report(message) {
  console.log(message);
}

skulk('Kuma')
```

上面的代码，执行上下文的行为如下：

1. 每个 JavaScript 程序只创建一个全局执行上下文，并从全局执行上下文开始。当执行全局代码时，全局执行上下文处于活跃状态。
2. 首先在全局代码中定义两个函数：skulk 和 report，然后调用 skulk('Kuma')。由于在同一个特定时刻只能执行特定代码，所以 JavaScript 引擎停止执行全局代码，开始执行带有 Kuma 参数的 skulk 函数。创建新的函数执行上下文，并置于执行上下文栈的顶部。
3. skulk 函数进而调用 report 函数。又一次因为在同一个特定时刻只能执行特定代码，所以，暂停 skulk 执行上下文，创建新的 Kuma skulking 作为参数的 report 函数的执行上下文，并置于执行上下文栈的顶部。
4. report 通过内置函数 console.log 打印出消息后，report 函数执行完成，代码又回到了 skulk 函数。report 函数执行上下文从执行上下文栈的顶部弹出，skulk 函数执行上下文重新激活，skulk 函数继续执行。
5. skulk 函数执行完成后也发生类似的事情：skulk 函数执行上下文从栈顶端弹出，重新激活一直在等待的全局执行上下文并恢复执行。JavaScript 的全局代码恢复执行。
