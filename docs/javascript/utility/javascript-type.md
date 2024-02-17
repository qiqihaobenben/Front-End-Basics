# JavaScript 数据类型（运行时）

程序 = 算法 + 数据结构，运行时类型包含了所有 JavaScript 执行时所需要的数据结构的定义。

JavaScript 语言的每一个值都属于某一种数据类型，JavaScript 语言规定了 8 种数据类型：

1. Undefined
2. Null
3. Boolean
4. String
5. Number
6. Symbol
7. BigInt
8. Object

前 7 种为基础数据类型，最后一种为复杂数据类型。

**运行时类型：** 代码实际执行过程中用到的类型。JavaScript 不支持任何创建自定义类型的机制，所有的类型数据都属于 8 个类型之一（乍一看，好像只有 8 种数据类型不足以表示所有数据，但是由于 JavaScript 数据类型具有动态性，因此的确没有再定义其他数据类型的必要了）。从变量、参数、返回值到表达式中间结果，任何 JavaScript 代码运行过程中产生的数据，都具有运行时类型。

## 类型

### Undefined

Undefined 类型表示未定义，它的类型只有一个值就是 undefined。

任何变量在赋值前（未初始化前）都是 Undefined 类型、值为 undefined。

我们也可以显式的给变量赋值为 undefined，可以用全局变量 undefined（就是名为 undefined 的这个变量）来表达这个值，或者 void 运算来把任意一个表达式变成 undefined 值。一般而言，不存在需要显式地把一个变量设置为 undefined 值的情况。字面量 undefined 的主要目的是用于比较，而 ES3 之前没有规定这个值，ES3 引入这个值是为了正式区分空对象指针（null）与未经初始化的变量。

#### 变量未初始化和未声明

对未初始化和未声明的变量执行 typeof 操作符都会返回 undefined。

```
// message未定义，age未声明
var message; // 这个变量声明之后默认取得了 undefined 值

console.log(typeof message); // undefined
console.log(typeof age); // undefined

console.log(message); // undefined
console.log(age); // 报错，age is not defined
```

这个结果有其逻辑上的合理性。因为虽然这两种变量从技术角度看有本质区别，但实际上无论对哪种变量都不可能执行真正的操作。所以即便未初始化的变量会自动被赋予 undefined 值，但显示地初始化变量依然是明智的选择。例如 `var message = 'hello world';`，如果做到所有的变量声明后都有初始化的值，那么当 typeof 操作符返回"undefined"值时，就知道被检测的变量还没有被声明，而不是尚未初始化。

#### undefined 是可以被修改的

JavaScript 代码中 undefined 是全局对象的一个属性（即全局作用域中的一个变量），而并非是一个关键字，这是 JavaScript 语言公认的设计失误之一，为了避免获取到无意中被篡改的 undefined，所以编程规范中会建议使用 void 0 来获取 undefined 值。

在 ES5 之前的时候，undefined 是可以被赋值的。不过在现代浏览器中已经把 undefined 设置为 non-configurable,non-writable。不过因为它总归不是一个关键字，在函数和块级作用域依然能用 undefined 作为标识符声明变量并赋值。

```
function fn(){
    undefined = 1; // 相当于操作window.undefined，是non-writable的
    console.log('undefined : ' + undefined);
}
fn();//undefined : undefined

// 以下undefined都被重新赋值了
function fn(){
    var undefined = 1;
    console.log('undefined : ' + undefined);
}
fn(); //undefined : 1

{
    let undefined = 1;
    console.log('undefined : ' + undefined);//undefined : 1
}
```

### Null

Null 表示定义了但是为空，Null 类型也只有一个值，就是 null，语义表示空值。从逻辑角度来看，null 值
表示一个空对象指针。

null 是 JavaScript 关键字，所以在任何代码中，都可以放心用 null 关键字来获取 null 值。

从概念上讲，undefined 表示值的缺失，null 表示对象的缺失（这也可以说明 typeof null === "object" 的原因）。

#### null 推荐用法

如果定义的变量准备在将来用于保存对象，那么最好将该变量初始化为 null 而不是其他值。这样一来，只要直接检查 null 值就可以知道相应的变量是否已经保存了一个对象的引用。例如：

```
if(car !== null) {
  // 对car对象执行某些操作
}
```

换句话说，只要打算保存对象的变量还没有真正保存对象，就应该明确地给把该变量赋值成 null。这样做不仅可以体现 null 作为空对象指针的惯例，而且也有助于进一步区分 null 和 undefined。

扩展：关于 undefined 和 null 的一篇文章：[undefined-null-revisited](https://2ality.com/2021/01/undefined-null-revisited.html)

### Boolean

Boolean 类型有两个值， true 和 false，它用于表示逻辑意义上的真和假。true 和 false 也是关键字。

需要注意的是，Boolean 类型的字面量 true 和 false 是区分大小写的。也就是说，True 和 False（以及其他的混合大小写形式）都不是 Boolean 值，只是标识符。

在 JavaScript 中所有类型的值都有对应的与 Boolean 等价的值，要将一个值转换为其对应的 Boolean 值
，可以调用转型函数 Boolean()，特别说明一点，**流控制语句（如 if 语句）会自动执行相应的 Boolean 转换**。

### String

String 用于表示文本数据，String 有最大长度 2^53 - 1。这个最大长度，并不完全是通常意义上理解的字符数。因为 String 的意义并非“字符串”，而是字符串的 UTF16 编码。字符串的操作 charAt、charCodeAt、length 等方法针对的都是 UTF16 编码。所以，字符串的最大长度，实际上是受字符串的编码长度影响的。

JavaScript 中的字符串是永远无法变更的，一旦字符串构造出来，无法用任何方式改变字符串的内容，所以字符串具有值类型的特征。要改变某个变量保存的字符串，首先要销毁原来的字符串，然后再用另一个包含新值的字符串填充该变量。

扩展：JavaScript 的浮点数遵循 IEEE754 规范，采用双精度值，用 64bit 表示一个数，但是其最大安全整数是 2^53-1，可以用 Number.MAX_SAFE_INTEGER 查看。超过这个值的运算是不安全的，比如 Number.MAX_SAFE_INTEGER+1===Number.MAX_SAFE_INTEGER+2 将返回 true。

### Number

Number 类型表示我们通常意义上的“数字”，大致对应数学中的有理数。

在计算机中，有一定的精度控制，JavaScript 中的 Number 类型基本符合 IEEE 754-2008 规定的双精度浮点数规则，JavaScript 中的 Number 类型有 18437736874454810627（2^64 - 2^53 + 3） 个值。根据双精度浮点数的定义，Number 类型中有效的整数范围是-0x1fffffffffffff 至 0x1fffffffffffff，所以 Number 无法精确表示此范围外的整数。

#### 几种数值字面量格式

为了支持各种数值类型，ECMA-262 定义了不同的数值字面量格式。

- 十进制

```
var intNum = 15;
```

- 二进制

二进制字面量的前两位必须是 0b，后必须跟任何二进制数字（0、1）

```
var intBinary = 0b1111; // 十进制的15
```

- 八进制

八进制字面量有两种。

第一种是按照最新规则，前两位必须是 0o，后必须跟任何八进制数字（0 ~ 7）。

```
var intOctal = 0o17; // 十进制的15
```

第二种是之前的规则，第一位必须是 0，后面跟任何八进制数字（0 ~ 7），如果字面量中的数值超出了范围，那么前导零将被忽略，后面的数值将被当做十进制数值解析（不报错），这个规则现在依然有效，不过**在严格模式下是无效的，会导致 JavaScript 引擎抛出错误**。

```
var intOctal = 017; // 十进制的15，如果是严格模式下，会报错

var intNum = 018; // 会忽略最开头的0，十进制的18
```

- 十六进制

十六进制字面量的前两位必须是 0x，后面必须跟任何十六进制数字（0 ~ 9 及 A ~ F）。其中，字母 A ~ F 可以大写，也可以小写。

```
var intHex1 = 0xF; // 十进制的15
var intHex2 = 0x1f; // 十进制的31
```

注意：在进行算术计算时，所有以二进制、八进制和十六进制表示的数值最终都将被转换成十进制数值。

#### 几个额外场景：NaN、Infinity、-Infinity

JavaScript 为了表达几个额外的场景（比如不让除以 0 出错，而引入了无穷大的概念），规定了几个 IEEE 规范外的情况：

- NaN：是占用了 9007199254740990 个特殊位置的集合，这原本是符合 IEEE 规则的数字，所以 NaN !== NaN ，因为 NaN 确实不是一个值，而是一群值。
- Infinity：无穷大
- -Infinity：负无穷大

#### NaN

NaN，即非数值（Not a Number）是一个特殊的数值，这个数值用于标识一个本来要返回数值的操作
数未返回数值的情况（这样就不会抛出错误了）。

例如，在其他编程语言中，任何数值除以非数值都会导致错误，从而停止代码执行。但在 JavaScript 中，任何
数值除以非数值会返回 NaN，因此不会影响其他代码的执行。

NaN 有两个特点：首先，任何涉及 NaN 的操作（例如 NaN/10）都会返回 NaN，这个特点在多步计算中有可能
导致问题。其次，NaN 与任何值都不相等，包括 NaN 本身。

针对 NaN 的这两个特点，JavaScript 定义了 isNaN 函数。这个函数接受一个参数，该参数可以是任何
类型，它会帮我们确定这个参数是否“不是数值”。isNaN()在接收到一个值之后，会尝试将这个值转换为数值（走 Number()逻辑），任何不能被转换为数值的值都会返回 true。

isNaN()也适用于对象。在基于对象调用 isNaN()函数时，会按照 toPrimitive -> valueOf -> toString 的过程依次确定各阶段返回的值是否可以转换为数值，最后确定是否“不是数值”。

#### +0、-0

JavaScript 中有+0 和-0，正零和负零被认为是相等的。在加法类运算中它们没有区别，但是除法的场合则需要特别留意区分。检测+0 和-0 的方式，就是用 1/x 看得到的结果是 Infinity 还是 -Infinity。

```
+0 === -0 // true

0/0 // NaN

1/(+0) // Infinity
1/(-0) // -Infinity
```

#### 浮点数值

所谓浮点数值，就是该数值中必须包含一个小数点，并且小数点后面必须至少一个数字。小数点前面可以没有整数（不推荐这种写法）。

```
var floatNum1 = 1.1;
var floatNum2 = .1; // 0.1 有效，但不推荐
```

由于保存浮点数值需要的内存空间是保存整数值的两倍。因此 JavaScript 会不失时机地将浮点数值转换为整数值。

- 如果小数点后面没有跟任何数字，那么这个数值就可以作为整数值保存。

```
var floatNum = 1.; // 小数点后没有数字，解析为整数 1
```

- 如果浮点数值本身表示的就是一个整数（如 1.0），那么该值也会被转换为整数。

```
var floatNum = 10.0; // 整数，解析为10
```

#### 浮点数值科学计数法

对于那些极大或极小的数值，可以用 e 表示法（即科学计数法）表示的浮点数值表示。用 e 表示法表示的数值等于 e 前面的数值乘以 10 的指数次幂。JavaScript 中 e 表示法的格式也是如此，即前面是一个数值（可以是整数也可以是浮点数），中间是一个大写或小写的字母 E，后面是 10 的幂中的指数，该幂值将用来与前面的数相乘。

例如：极大值

```
var floatNum = 3.125e7; // 3.125 乘以 10^7 等于 31250000
```

例如：极小值

在默认情况下，JavaScript 会将那些小数点后面带有 6 个零以上的浮点数值转换为以 e 表示法表示的数值。

```
var floatNum = 0.0000003;
console.log(floatNum); // 3e-7
```

#### 浮点数值比较方法

根据浮点数的定义，浮点数值的最高精度是 17 位小数，所以在进行算术运算时其精确度远远不如整数。非整数的 Number 类型无法用 == （===也不行）来比较。

```
console.log(0.1 + 0.2 == 0.3); // false
// 0.1 + 0.2 的结果是0.30000000000000004
```

这里的输出结果是 false，说明两边不相等，这是浮点运算的特点，浮点运算的精度问题导致等式左右的结果并不是严格相等，而是相差了一个微小的值。所以这里得出的错误结论是我们使用的比较方法不正确，正确的比较方法是使用 JavaScript 提供的最小精度值，检查等式左右两边的差的绝对值是否小于等于最小精度，才是正确比较浮点数的方法：

```
console.log(Math.abs(0.1 + 0.2 - 0.3) <= Number.EPSILON) // true
```

注意：关于浮点数值计算会产生舍入误差的问题，有一点需要明确：这是使用基于 IEEE754 数值的浮点计算的通病，ECMAScript 并非独此一家；其他使用相同数值格式的语言也存在这个问题。

### Symbol

Symbol 是 ES6 引入的新类型，它是一切非字符串的对象 key 的集合，在 ES6 规范中，整个对象系统被用 Symbol 重塑。

创建 Symbol 的方式是使用全局的 Symbol 函数：

```
var mySymbol = Symbol("my symbol");
```

Symbol 可以具有字符串类型的描述（即上面代码中括号里面的 "my symbol"），但即使描述相同，Symbol 也不相等。

一些标准中提到的 Symbol，可以在全局的 Symbol 函数的属性中找到，例如，我们可以使用 Symbol.iterator 来定义 for……of 在对象上的行为。这些标准中被称为“众所周知”的 Symbol，也构成了语言的一类接口形式。它们允许编写与语言结合更紧密的 API。

```
var o = {}

o[Symbol.iterator] = function () {
  var v = 0;
  return {
    next: function () {
      return {value: v++, done: v > 10}
    }
  }
}

for(var v of o)
  console.log(v); // 0 1 2 3 …… 9
```

### Object

Object 是 JavaScript 中最复杂的类型，也是 JavaScript 的核心机制之一。Object 表示对象的意思，它是一切有形和无形物体的总称。

在 JavaScript 中，对象的定义是“属性的集合”。属性分为数据属性和访问器属性，二者都是 key-value 结构，key 可以是字符串或者 Symbol 类型

JavaScript 中的类和类型的关系跟 C++ 和 Java 不同，C++和 Java 中，每个类都是一个类型，二者几乎等同，而 JavaScript 中的“类”仅仅是运行时对象的一个私有属性，JavaScript 中是无法自定义类型的。

#### Object 实例

在 JavaScript 中，Object 类型是所有它的实例的基础。换句话说，Object 类型所具有的任何属性和方法也同样存在于更具体的对象中。

Object 的每个实例都具有下列属性和方法：

- constructor：保存着用于创建当前对象的函数，即构造函数。
- hasOwnProperty(propertyaName)：用于检查给定的属性在当前对象的实例中（而不是在实例的原型中）是否存在。
- isPrototypeOf(object)：用于检查传入的对象是否是当前对象的原型链上。
- propertyIsEnumerable(propertyName)：用于检查给定的属性是否能够使用 for-in 语句来枚举。
- toLocaleString()：返回对象的字符串表示，该字符串与执行环境的地区对应。
- toString()：返回对象的字符串表示。
- valueOf()：返回对象的字符串、数值或布尔值表示。通常与 toString()方法返回值相同。

#### 基本类型的对象类型

- Number
- String
- Boolean

Number、String 和 Boolean 这个三个构造器是两用的，当跟 new 搭配时，它们产生对象，当直接调用时，它们表示强制类型转换。

所以，我们必须认识到 3 和 new Number(3)是完全不同的值，它们一个是 Number 类型，一个是对象类型。

JavaScript 语言设计上试图模糊对象和基本类型之间的关系，让我们可以把对象的方法在基本类型上使用，所以运算符提供了装箱操作，它会根据基础类型构造一个临时对象，使得我们能在基础类型上调用对应对象的方法。

例如：

```
console.log("abc".charAt(0)); //a
```

**在创建变量时，对于 boolean、number、string、null 和 undefined 这个五个原始值类型来说，字面量优于封装对象**

- 封装对象会占用更大的内存
- 相同的字符串也无法比较，例如，new 出来的 String 是一个真正的对象，每个 String 对象对是一个单独的对象，即使是两个相同的字符串，两者的引用也不相同。

```js
const s1 = new String('hello')
const s2 = new String('hello')
typeof 'hello' // string
typeof s1 // object
typeof s2 // object
s1 === s2 // false
s1 == s2 // false
```

#### 扩展

从技术角度讲，ECMA-262 中对象的行为不一定适用于 JavaScript 中的其他对象。浏览器环境中的对象，比如 BOM 和 DOM 中的对象，都属于宿主对象，因为它们是由宿主环境提供和定义的。ECMA-262 不负责定义宿主对象，因此宿主对象可能会也可能不会继承 Object。

## 类型转换

JavaScript 是弱类型语言，所以类型转换发生的非常频繁，大部分我们熟悉的运算都会先进行类型转换。

注意：可以忽略 == 规则，它属于设计失误，并非语言中有价值的部分，很多实践中推荐禁止使用 ==，而要求进行显式的类型转换后，用 === 比较。

![](./images/type1.jpg)

### StringToNumber

String 转换成 Number 时，建议使用 一元加操作符`+` 或 Number() 进行 **Number 强制类型转换（String 类型隐式转换为 Number 类型时，就是用的 一元加操作符 ）**，不推荐使用 parseInt() 和 parseFloat()。

#### Number()

##### Number() 会把数字字符串转换为数字，不是数字字符串的返回值就是 NaN。

- 如果字符串只包含数字（包括前面带正号或负号的情况，符号标志只能出现一次，并且后面不能跟空格）则将其转换为十进制数值，即"1"会变成 1，而"011" 会变成 11（注意：前导的零被忽略了）
- 如果字符串中包含有效的浮点格式（小数点只能出现一次），如"1.1"，则将其转换为对应的浮点数值（同样，也会忽略前导零）
- 如果字符串中包含有效的二进制、八进制和十六进制，例如"0xf"，则将其转换为相同大小的十进制整数。
- 如果是空字符串或仅包含空格的字符串转换为 0。。
- 如果字符串中包含除上述格式之外的字符（数字分隔符也不能使用），则将其转换为 NaN。
- 前导和尾随的空格/换行符会被忽略
- Infinity 和 -Infinity 被当作是字面量。在实际代码中，它们是全局变量。

##### Number 强制转换的其他规则

- Number 将按原样返回
- undefined 转换为 NaN。
- null 转换为 0。
- true 转换为 1；false 转换为 0。
- BigInt 抛出 TypeError，以防止意外的强制隐式转换导致精度损失。（一元加操作符会遵循，Number()不会抛出 TypeError，而是返回其数字值，并且可能导致精度损失）
- Symbol 抛出 TypeError。
- 对象首先通过按顺序调用它们的 [@@toPrimitive](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive)（使用 "number" 提示）、valueOf() 和 toString() 方法将其转换为原始值（拆箱操作）。然后将得到的原始值转换为数字。

##### 注意：一元加操作符的操作与 Number() 函数几乎相同。一元加操作符会完全按照 Number 强制转换规则， Number() 在处理 BigInt 类型时跟规则不同。

#### parseInt(string, radix);

parseInt(string, radix) 解析一个字符串并返回指定基数的**十进制整数**，radix 是 2-36 之间的整数，表示被解析字符串的基数。

- string 要被解析的值

  - 如果参数不是一个字符串，则将其转换为字符串（使用 ToString）。
  - 字符串开头的空白符将会被忽略。
  - 如果第一个字符不是数字字符或者符号，就返回 NaN。
  - 如果第一个字符是数字，就继续解析第二个字符，直到解析完所有的后续字符或者遇到了一个非数字字符。

- radix 可选（建议必传）

  从 2 到 36，代表该进位系统的数字。例如指定 10 就是 10 进制。**注意：默认值不是 10 进制**。如果 radix 是 undefined、0 或未指定的，JavaScript 会假定一下情况：

  1. 如果输入的 string 以 0x 或 0X 开头，那么 radix 被假定为 16，字符串的其余部分被解析为十六进制数。
  2. 如果输入的 string 以 0 开头，radix 被假定为 8（ES3） 或 10，具体取决浏览器的实现。ECMAScript5 澄清了应该使用 10，但不是所有浏览器都支持。**因此，在使用 parseInt 时推荐一定要指定一个 radix**。
  3. 如果输入的 string 以任何其他值开头，radix 是 10。
  4. 如果 parseInt 遇到的字符不是指定 radix 参数中的数字，它将忽略该字符以及后续字符，并返回到该点为止已解析的整数值。parseInt 将数字截断为整数值，允许前导和尾随空格。

- 返回值：从给定字符串中解析出的一个**十进制整数**或者 NaN

  ```
  var num1 = parseInt(""); // NaN
  var num2 = parseInt("abc"); // NaN
  var num3 = parseInt("   -123"); // -123
  var num4 = parseInt("123abc"); // 123
  var num5 = parseInt("123.5"); // 123
  var num6 = parseInt("0xF"); // 15
  var num7 = parseInt("F", 16) // 15
  var num8 = parseInt("070", 8); // 56
  var num9 = parseInt("070", 10); // 70
  ```

#### parseFloat()

parseFloat() 函数解析一个参数（必要时先转换为字符串）并返回一个浮点数。

parseFloat() 也是从第一个字符（位置 0）开始解析每个字符，一直解析到字符串末尾或者解析到遇见一个无效的浮点数字字符位置。也就是说，字符串的第一个小数点是有效的，而第二个小数点就是无效的了。

- 始终忽略前导的零
- 直接把原字符串作为十进制来解析，没有用第二个参数指定基数的用法，它不会引入任何的其他进制。
- 二进制、八进制、十六进制格式的字符串始终会转换成 0。

```
var num1 = parseFloat("123abc"); // 123
var num2 = parseFloat("0xF"); // 0
var num3 = parseFloat("22.5"); // 22.5
var num4 = parseFloat("22.34.5"); //22.34
var num5 = parseFloat("022.5"); //22.5
var num6 = parseFloat("3.125e7"); //31250000
```

### NumberToString

在较小的范围内，数字到字符串的转换是完全符合直觉的十进制表示。**当 Number 绝对值较大或者较小时，字符串表示则是使用科学计数法表示的，应该就是为了保证产生的字符串不会过长。**

#### toString()

数值、布尔值、对象和字符串都有 toString()方法，但是 null 和 undefined 没有这个方法。

多数情况下，调用 toString()方法不必传递参数，但是调用**数值**的 toString()方法时，可以传递一个参数：输出数值的基数。默认情况下，以十进制格式返回数值的字符串表示。

```
var num = 10;
console.log(num.toString()); // "10"
console.log(num.toString(2)); // "1010"
console.log(num.toString(8)); // "12"
console.log(num.toString(10)); // "10"
console.log(num.toString(16)); // "a"
```

注意：NaN 也是一个数值，肯定也有 toString()方法。

#### String()

String()转型函数也能够将任何类型的值转换成字符串。转换的规则如下：

- 如果值有 toString()方法，则调用该方法（没有参数）并返回相应的结果。
  - 数值：转为相应的字符串
  - 字符串：转换后还是原来的值
  - 布尔值：true 转为字符串"true"，false 转为字符串"false"
- 如果值是 null，则返回"null"。
- 如果值是 undefined，则返回"undefined"。

**扩展：** 要把某个值转换为字符串，可以使用加号操作符把它与一个字符串（""）加在一起。

### Boolean() 转换

Boolean()函数可以将任意类型的值转为布尔值。

它的转换规则相对简单：除了以下五个值的转换结果为 false，其他的值全部为 true。

- undefined
- null
- 0（包含-0 和+0）
- NaN
- ''（空字符串）

### 装箱转换

每一种基本类型 Number、String、Boolean、Symbol 在对象中都有对应的类，所谓装箱转换，正是把基本类型转换为对应的对象。

隐式的装箱转换产生对象是基本包装类型，显式调用装箱转换产生的是引用类型。引用类型与基本包装类型的主要区别就是对象的生存期。使用 new 操作符创建的引用类型的实例，在执行流离开当前作用域之前都一直保存在内存中。而自动创建的基本包装类型的对象，则只存在于一行代码的执行瞬间，然后立即被销毁。

#### 隐式装箱转换过程

例如下面的代码，变量 s1 包含一个字符串，字符串当然是基本类型，而下一行调用了 s1 的 substring()方法，并将返回的结果保存在了 s2 中。基本类型不是对象，从逻辑上讲不应该有方法，但是我们确实调用到了方法。原因是，点操作符会触发装箱操作（读取模式），把基本类型转换成了基本包装类型。

```
var s1 = "hello";
var s2 = s1.substring(2);
```

具体的转换过程如下：

1. 创建对应类型的实例，此处是 String 类型的实例；
2. 在实例上调用指定的方法；
3. 销毁这个实例。

根据转换过程描述来看，意味着我们不能在运行时为基本类型值添加属性和方法。

```
var s1 = "hello";
s1.color = "red";
console.log(s1.color)  // undefined
```

上面的代码中的第二行尝试为字符串 s1 添加一个 color 属性。但是，当第三行代码再次访问 s1 时，其 color 属性不见了。问题的原因就是第二行创建的 String 对象在执行第三行代码时已经被销毁了。第三行代码有创建了自己的 String 对象。而该对象没有 color 属性。

#### 显式调用装箱转换

Number、String、Boolean 这三种类型可以使用 new 来调用得到对应的对象类型，全局的 Symbol 函数无法使用 new 调用，但是仍可利用装箱机制来得到一个 Symbol 对象，就是利用一个函数的 call 方法来强迫产生装箱。例如：定义一个函数，函数里面只有 return this，然后我们调用函数的 call 方法到一个 Symbol 类型的值上，这样就产生了一个 symbolObject。

```
var symbolType = Symbol('a')
console.log(typeof symbolType) // symbol

var symbolObject = (function () {return this}).call(Symbol('a'))
console.log(typeof symbolObject) // object
console.log(symbolObject instanceof Symbol) // true
```

使用内置的 Object 函数，可以在 JavaScript 代码中显示调用装箱能力

```
var symbolObject = Object(Symbol('a'));
console.log(typeof symbolObject); // object
console.log(symbolObject instanceof Symbol) // true
```

装箱机制会频繁产生临时对象，在一些对性能要求较高的场景下，我们应该尽量避免对基本类型做装箱转换。

#### 更好的判断类型方法

每一类装箱对象皆有私有的 Class 属性（即[[Class]]属性），这些属性可以用 Object.prototype.toString 获取，在 JavaScript 中，没有任何方法可以更改私有的 Class 属性，因此 Object.prototype.toString 是可以准确识别对象对应的基本类型的方法，它比 instanceof 更加准确。

```
var symbolObject = Object(Symbol('a'));
console.log(Object.prototype.toString.call(symbolObject)) // [object Symbol]
```

注意：点运算符会装箱，call 本身会产生装箱操作，所以需要配合 typeof 来区分基本类型还是对象类型。

### 拆箱转换

对象到 String 和 Number 的转换都遵循“先拆箱再转换”的规则。通过拆箱转换，把对象变成基本类型，再从基本类型转换为对应的 String 或者 Number。

在 JavaScript 标准中，规定了 ToPrimitive 函数，他是对象类型到基本类型的转换（即拆箱转换）。

#### 转换过程

1. 当一个对象要转换为对应的原始值时，会调用 ToPrimitive(input[,PreferredType])方法进行转换，这个方法的作用就是将输入转换成一个非对象类型。参数 PreferredType 是可选的，它的作用是确定要转成的类型。如果不传 PreferredType，默认是 number。

2. 如果设置了 [Symbol.toPrimitive] 时，会直接调用此函数，它必须返回原始值，如果返回对象，会导致 TypeError。否则进入第三步。

3. 根据 PreferredType 决定 valueOf 和 toString 的调用顺序。如果 PreferredType 的值是 string，那就先执行 toString，后执行 valueOf。否则，先执行 valueOf，后执行 toString。

4. 拆箱转换会尝试调用 valueOf 和 toString 来获得拆箱后的基本类型。如果其中一个返回对象，则忽略其返回值，从而使用另一个的返回值。如果 valueOf 和 toString 都不存在，或者没有返回基本类型，则会产生类型错误 TypeError。

#### 拆箱转换为 Number

数值转换发生在对象相减或其他应用数学运算、函数时。

例一：定义一个对象 o，o 有 valueOf 和 toString 两个方法，这两个方法都返回一个对象，然后运行 `o * 2`，会看到限制性了 valueOf，然后是 toString，最后抛出了 TypeError,说明这个拆箱转换失败。

```
var o = {
  valueOf: () => {console.log('valueOf');return {}},
  toString: () => {console.log('toString');return {}},
}

o * 2
// valueOf
// toString
// TypeError
```

#### 拆箱转换为 String

字符串转换通常发生在像 alert(obj)这样输出一个对象和类似的情况中。

例二：到 String 的拆箱转换会优先调用 toString，把上面的运算从 `o * 2` 改成 `String(o)`，会看到调用顺序变了。

```
var o = {
  valueOf: () => {console.log('valueOf');return {}},
  toString: () => {console.log('toString');return {}},
}

String(o)
// toString
// valueOf
// TypeError
```

ES6 之后，还允许对象通过显示指定 @@toPrimitive Symbol 来覆盖原有的行为。 [Symbol.toPrimitive]是一个内置的 Symbol 值，它是作为对象的函数值属性存在的，当一个对象转换为对应的原始值时，会调用此函数。

```
var o = {
  valueOf: () => {console.log('valueOf');return {}},
  toString: () => {console.log('toString');return {}},
}

o[Symbol.toPrimitive] = () => {console.log("toPrimitive"); return "hello"}

console.log(o + '')
// toPrimitive
// hello
```

#### 总结一下

有三种不同的路径可以将对象转换为原始值：

- 原始值强制转换：`[@@toPrimitive]("default")` → `valueOf()` → `toString()`
- 数字类型强制转换、number 类型强制转换、BigInt 类型强制转换：`[@@toPrimitive]("number")` → `valueOf()` → `toString()`
- 字符串类型强制转换：`[@@toPrimitive]("string")` → `toString()` → `valueOf()`

## typeof 运算符

鉴于 JavaScript 是弱类型的，因此需要有一种手段来检测给定变量的数据类型——typeof 就是负责提供这方面信息的操作符。

JavaScript 类型一直存在一个争议。一方面，标准中你规定了运行时的数据类型；另一方面，JavaScript 语言中提供了 typeof 运算符，用来返回操作数的类型，typeof 的运算结果跟运行时类型的规定有不一致的地方，主要是 null 和 function 这两个特例。

![](./images/type2.png)

### 特例 1

typeof null 会返回 "object"，这是由于历史原因造成的，1995 年 JavaScript 语言的第一版，只设计了五种数据类型（对象、整数、浮点数、字符串和布尔值），没有考虑 null，只把它当做 object 的一种特殊值，**特殊的 null 被认为是一个空的对象引用**。后来 null 独立出来，作为一种单独的数据类型，为了兼容以前的代码，typeof null 返回 object 就没法改变了。

### 特例 2

从技术角度讲，函数在 JavaScript 中是对象，不是一种数据类型。然而，函数也确实有一些特殊的属性，因此通过 typeof 操作符来区分函数和其他对象是很有必要的。

### 结论

从一般语言使用者的角度来看，毫无疑问，我们应该按照 typeof 的结果去理解语言的类型系统。但 JavaScript 之父本人在多个场合表示过，typeof 的设计是有缺陷的，只是现在已经错过了修正它的时机。

## 从内存角度看基础类型和引用类型的值

按照 ECMA-262 的定义，JavaScript 的变量与其他语言的变量有很大区别。JavaScript 变量松散类型的本质，决定了它只是在特定时间用于保存特定值的一个名字而已。由于不存在定义某个变量必须要保存何种数据类型值的规则，变量的值及其数据类型可以在脚本的声明周期内改变。

在 JavaScript 中，每一个变量在内存中都需要一个空间来存储。内存空间又被分为两种，栈内存与堆内存。

### 栈内存

- 存储的值大小固定
- 空间较小
- 可以直接操作其保存的变量，运行效率高
- 由系统自动分配存储空间

基本类型也称为原始类型，在 ECMAScript 标准中，它们被定义为 primitive values，即原始值，代表**值本身是不可被改变的**。JavaScript 中基本类型的值被直接存储在栈中，在变量定义时，栈就为其分配好了内存空间。由于栈中的内存空间的大小是固定的，那么注定了存储在栈中的变量就是不可变的。

基本数据类型是按值访问的，可以操作保存在变量中的实际的值。

### 堆内存

- 存储的值大小不定，可动态调整
- 空间较大，运行效率低
- 无法直接操作其内部存储，使用引用地址读取
- 通过代码进行分配空间

引用类型的值实际存储在堆内存中，JavaScript 不能直接操作引用类型的内存空间，所以引用类型在栈中存储了一个固定长度的地址，这个地址指向堆内存中的值。

### 复制变量值

当我们把一个变量的值复制到另一个变量上时，基本类型和引用类型的表现也不一样。

如果从一个变量向另一个变量复制基本类型的值，会在内存中创建一块新的空间用于存储复制的副本新值，虽然复制的两者值是相同的，但是两者指向的内存空间完全不同。这两个变量参与任何操作都互不影响。

当复制引用类型的变量时，实际上复制的栈中存储的地址，所以复制出来的两个变量指向的是堆中同一个对象。因此，我们改变其中任何一个变量值，另一个变量也会受到影响。但是如果给那个复制出来的变量重新赋值，就会完全切断与当前引用类型的关系，两者也就互不影响了。

### 比较

对于原始类型，比较时会直接比较他们的值，如果值相等就相等。

对于引用类型，比较时会比较他们的引用地址，虽然两个变量在堆中存储的对象具有一模一样的属性值，但是他们被存储在了不同的存储地址，因为比较时会不相等。

## 链接

- [Number 强制转换](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number#number_%E5%BC%BA%E5%88%B6%E8%BD%AC%E6%8D%A2)
- [原始值强制转换](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#%E5%8E%9F%E5%A7%8B%E5%80%BC%E5%BC%BA%E5%88%B6%E8%BD%AC%E6%8D%A2)
