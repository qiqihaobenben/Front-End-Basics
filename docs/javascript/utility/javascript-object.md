# JavaScript 对象相关

## 对象的定义

### 广义的定义（自然定义）

Object（对象）在英文中，**是一切事物的总称**。

对象并不是计算机领域凭空造出来的概念，它是顺着人类思维模式产生的一种抽象（于是面向对象编程也被认为是：最接近人类思维模式的一种编程范式）。对象这一概念在人类的幼儿期形成，远远早于我们编程逻辑中常用的值、过程等概念。

> 在幼年期，我们总是先认识到某一个苹果能吃（这里的某一个苹果就是一个对象），继而认识到所有的苹果都可以吃（这里的所有苹果，就是一个类），再后来我们才能意识到三个苹果和三个梨之间的联系，进而产生数字“3”（值）的概念。

《面向对象分析与设计》这本书中认为，从人类的认知角度来说，对象应该是下列事物之一：

1. 一个可以触摸或者可以看见的东西；
2. 人的智力可以理解的东西；
3. 可以指导思考或行动（进行想象或施加动作）的东西。

### 编程语言的定义

有了对象的自然定义后，我们就可以描述编程语言中的对象了。在不同的编程语言中，设计者也利用各种不同的语言特性来抽象描述对象，最为成功的流派是使用“类”的方式来描述对象，这诞生了诸如 C++、Java 等流行的编程语言。

### JavaScript 的定义

JavaScript 最初选择了一个更冷门的方式：用原型的方式抽象描述对象。不过因为历史原因，JavaScript 被要求模仿 Java，所以 JavaScript 在“原型运行时”的基础上引入了 new、this 等语言特性，使之“看起来更像 Java”。

引用类型的值（对象）是引用类型的一个实例，在 JavaScript 中引用类型是一种数据结构，用于将数据和功能组织在一起。引用类型有时候也被称为对象定义，因为他们描述的是一类对象所具有的属性和方法。对象就是某个特定引用类型的实例。

JavaScript 的对象是一种数据类型。对象可以看成是属性的无序集合，每个属性都是一个键值对，属性以字符串或 Symbol 为 key，以数据属性特征值或者访问器属性特征值为 value。因此可以把对象看成是从字符串到值的映射，对象也可以理解为是一个属性的索引结构。这种数据结构在其他语言中称之为“散列(hash)”、“字典(dictionary)”、“关联数组(associative array)”等。

如果我们从运行时角度来谈论对象，就是在讨论 JavaScript 实际运行中的模型。这是由于任何代码执行都必定绕不开运行时的对象模型。不过，幸运的是，从运行时的角度看，可以不必受到这些“基于类的设施”的困扰，这是因为任何语言运行时类的概念都是被弱化的。

## 对象的特点（JavaScript 对象的设计思路）

### 编程语言对象的本质特征

《面向对象分析与设计》提到：不论使用什么样的编程语言，都应该去理解对象的本质特征，总结来看，对象有如下几个特点：

- 对象具有唯一标识性：即使完全相同的两个对象，也并非同一个对象。
- 对象有状态：对象具有状态，同一对象可能处于不同状态下。
- 对象具有行为： 即对象的状态，可能因为它的行为产生变迁。

对象具有唯一标识性，一般而言，各种语言的对象唯一标识性都是用内存地址来体现的，对象具有唯一标识的内存地址。

关于“状态和行为”，不同语言会使用不同的术语来抽象描述它们，比如 C++中称它们为“成员变量”和“成员函数”，Java 中称它们为“属性”和“方法”。而在 JavaScript 中，将状态和行为统一抽象为“属性”，考虑到 JavaScript 中将函数设计成一种特殊对象，所以 JavaScript 中的行为和状态都能用属性来抽象。

### JavaScript 对象的特点

在实现了对象基本特征的基础上，JavaScript 对象还具有独有的特点：

原型式继承：对象不仅仅是字符串到值的映射，除了可以保持自有的属性，JavaScript 对象还可以从一个称之为原型的对象继承属性，对象的方法通常是继承的属性，这是 JavaScript 的核心特征。

JavaScript 对象是动态的—可以新增属性也可以删除属性，但是他们常用来模拟静态以及静态类型语言中的“结构体”

## JavaScript 对象的两类属性

下面从运行时的角度，介绍 JavaScript 对象的具体设计：具有高度动态性的属性集合

为了提高抽象能力，JavaScript 的属性被设计成比别的语言更加复杂的形式，分为数据属性和访问器属性（getter/setter）两类。

并且要说明一点，在 JavaScript 中，对象的属性并非只是简单的名称和值，JavaScript 用一组特征（attribute）来描述属性（property）。这一组特征是私有属性，用两对方括号抱起来， ECMA-262 定义这些特征是为了实现 JavaScript 引擎用的，因此在 JavaScript 中不能直接访问他们。要设置和修改这些特征，必须使用 Object.defineProperty()、Object.defineProperties()等方法。要读取属性这些特征需要使用 Object.getOwnPropertyDescriptor() 方法。

### 数据属性

数据属性包含一个数据值的位置，在这个位置可以读取和写入值。数据属性类似于其它语言的属性概念，大多数情况下，我们也只会关心数据属性。数据属性具有四个特征：[[Value]]、[[Writable]]、[[Enumerable]]、[[Configurable]]。

- value：就是属性的值
- writable：决定属性能否被赋值
- enumerable：决定 for in 能否枚举该属性
- configurable：决定该属性能否被删除或者改变特征值（包括改为访问器属性）。而且一旦定义为 false，即把属性定义为不可配置的，就不能再把它变回可配置了。

### 访问器（getter/setter）属性

访问器属性使得属性在读和写时执行代码，它允许使用者在写和读属性时，得到完全不同的值，它可以视为属性的一种函数的语法糖。访问器属性也有四个特征：[[Get]]、[[Set]]、[[Enumerable]]、[[Configurable]]

- getter：函数或 undefined，在取属性值时被调用。默认为 undefined。
- setter：函数或 undefined，在设置属性值时被调用。默认为 undefined。
- enumerable：决定 for in 能否枚举该属性。
- configurable：决定该属性能否被删除或者改变特征值（包括改为访问器属性）。而且一旦定义为 false，即把属性定义为不可配置的，就不能再把它变回可配置了。

不一定非要同时制定 getter 和 setter。只指定 getter 意味着属是不能写，尝试写入属性会被忽略，严格模式下会抛出错误。只指定 setter 函数的属性也不能读，非严格模式下读取属性会返回 undefined，在严格模式下会抛出错误。

### 实际使用

#### 创建对象字面量时直接定义属性

我们通常会直接在对象上定义属性，这些属性基本都是数据属性，它们的特征值中，value 就是属性值，其他的 writable、enumerable、configurable 都默认为 true。关于数据属性的特征值可以使用 getOwnPropertyDescriptor 来查看。

```
var o = {a: 1};
o.b = 2;
//a和b均为数据属性
Object.getOwnPropertyDescriptor(o,'a') // {value: 1, writable: true, enumerable: true, configurable: true}
Object.getOwnPropertyDescriptor(o,'b') // {value: 2, writable: true, enumerable: true, configurable: true}
```

虽然在对象字面量上定义的大多都是数据属性，但也是可以定义访问器属性的，不过不是那么常用，其中 enumerable、configurable 也是默认为 true。

```
var o = {
    a: 1,
    get doubleA () {
        return this.a * 2;
    }
}
console.log(o.doubleA) // 2
Object.getOwnPropertyDescriptor(o, 'doubleA') // {set: undefined, enumerable: true, configurable: true, get: ƒ doubleA()}
```

#### 使用 Object.defineProperty 定义属性和更改属性特征

我们可以使用 Object.defineProperty 定义或改变属性的**特征**，包括定义访问器属性，特征值中如果没定义 writable、enumerable、configurable，则他们的默认值为 false。

```
var o = {a: 1};
Object.defineProperty(o, 'b', {
    value: 2
})
Object.defineProperty(o, 'c', {
    value: 3,
    writable: true
})
Object.defineProperty(o, 'doubleA', {
    get () {
        return this.a * 2
    },
    enumerable: true
})
// a、b、c 都是数据属性，但是特征值不同了，doubleA是访问器属性，但是特征值也不是默认的了。
Object.getOwnPropertyDescriptor(o, 'a') // {value: 1, writable: true, enumerable: true, configurable: true}
Object.getOwnPropertyDescriptor(o, 'b') // {value: 2, writable: false, enumerable: false, configurable: false}
Object.getOwnPropertyDescriptor(o, 'c') // {value: 3, writable: true, enumerable: false, configurable: false}
Object.getOwnPropertyDescriptor(o, 'doubleA') // {set: undefined, enumerable: true, configurable: false, get: ƒ}
```

如上面的代码所示，使用 Object.defineProperty 来定义属性，可以改变属性的 writable、 enumerable、 configurable 这些特征的值。

## 对象的相关操作

### 创建对象

#### 1、对象字面量（对象直接量）

创建对象最简单的方式就是在 JavaScript 代码中使用对象字面量。

```
var book = {
            "main title": 'guide',  //属性名字里有空格，必须加引号
            "sub-title": 'JS',  //属性名字里有连字符，必须加引号
            for: 'development',  //for是关键字，不过从ES5开始，关键字和保留字作为属性名可以不加引号
            author: {
                firstname: 'David',  //这里的属性名就都没有引号
                surname: 'Flanagan'
            }
        }
```

**注意：** 从 ES5 开始，对象字面量中的最后一个属性后的逗号将被忽略。

扩展： [JavaScript 中的关键字和保留字
](http://blog.mingsixue.com/it/JS-keyword-reserved.html)

#### 3、通过 new JavaScript 提供的构造器创建对象

`new` 运算符创建并初始化一个新对象。关键字 new 后跟一个函数调用。这里的函数称做构造函数(constructor)，构造函数用以初始化一个新创建的对象。JavaScript 中的数据类型都包含内置的构造函数。

`var o = new Object();` //创建一个空对象，和{}一样。早期的 JavaScript 开发人员经常使用这个模式创建对象，几年后，对象字面量成为创建这种对象的首选模式。
`var arr = new Array();` //创建一个空数组，和[]一样。

> **扩展 1：new**

`new` 是一个一元运算符，专门运算函数的。new 后面调用的函数叫做构造函数，构造函数 new 的过程叫做实例化。
当 new 去调用一个函数 : 这个时候函数中的 this 就指向创建出来的对象,而且函数的的返回值直接就是 this(隐式返回)
有一个默认惯例就是构造函数的名字首字母大写。

_注意：_
当 return 的时候，如果是后面为简单类型，那么返回值还是这个对象；
如果 return 为对象类型，那么返回的就是 return 后面的这个对象。

> **扩展 2：基本类型和对象类型（复杂类型）的区别**

**赋值：**
基本类型 : 赋值的时候只是值的复制。
对象类型 : 赋值虽然也是值的复制，但是这个值是个引用地址（可以理解为指向内存地址的指针）。

**比较相等**
基本类型 : 值相同就可以
对象类型 : 值和引用都相同才行

> **扩展 3：原型 prototype**

每一个 JavaScript 对象(null 除外)都和另一个对象相关联，这个对象就是原型，每一个对象都从原型继承属性。

#### 3、Object.create()

`Object.create()` 这个方法是 ES5 定义的，它创建一个新对象，其中第一个参数是这个对象的原型。第二个参数是可选参数，用以对对象属性进行进一步描述。

可以通过传入参数 `null` 创建一个没有原型的新对象，不过这个新对象不会继承任何东西，甚至不包括基础方法。
`var o = Object.create(null);` //o 不会继承任何属性和方法,空空的。

如果想创建一个普通的空对象，需要传入`Object.prototype`
`var o = Object.create(Object.prototype);` //o 相当于{}

#### 4、其他能创建对象的方式

```
var a = Object.assign({})
var j = JSON.parse('{}')
var o = Object(null)
```

### 对象属性的获取和设置

可以通过点(.)或方括号([])运算符来获取和设置属性的值。

```
var author = book.author;
var title = book["main title"];
```

在 JavaScript 中能用 `.` 连接的都可以用 `[]`连接。有很多 `.` 运算符不能用的时候，就需要用`[]`代替。

1、在属性名可变的情况下用`[]`

```
function getAttr (obj, attr) {
    console.log(obj[attr])
}
```

2、属性名有空格或者连字符等时用`[]`

`var title = book["main title"];`

### 删除属性

delete 运算符可以删除对象的属性。

delete 只是断开属性和原来对象的联系，而不会去操作属性中的属性，如果删除的属性是个对象，那么这个对象的引用还是存在的。

```
var a = {b:{c:1}};
var b = a.b;
console.log(b.c); // 1
console.log(a.b); // {c:1}
delete a.b;
console.log(b.c); // 1
console.log(a.b); //undefined
```

**delete 只能删除自有属性，不能删除继承属性。**

#### 返回值

> 返回值为 true

当 delete 表达式删除成功或没有任何副作用(比如删除不存在的属性)，或者 delete 后不是一个属性访问表达式，delete 会返回 `true` ；

```
var a = {b:{c:1}};
console.log(delete a.b);
console.log(delete a.b); // 删除不存在的属性
console.log(delete a.toString);
console.log(delete 1); // 不是属性访问表达式

以上都会打印true
```

> 返回值为 false

delete 不能删除那些可配置性为 false 的属性，例如某些内置对象的属性是不可配置的，通过变量声明和函数声明创建的全局对象的属性。

```
var a = {};
Object.defineProperty(a,'b',{
    value:1,
    configurable: false // 设置为不可配置
})
console.log(delete a.b)
console.log(delete Object.prototype)
var x = 1;
console.log(delete this.x);
console.log(delete x)

以上打印都为false
```

### 对象方法和属性的汇总

#### Object 静态方法

- [Object.assign()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

- [Object.create()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)

- [Object.defineProperty()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

- [Object.defineProperties()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties)

- [Object.entries()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)

- [Object.preventExtensions()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions)

- [Object.isExtensible()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible)

- [Object.seal()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/seal)

- [Object.isSealed()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isSealed)

- [Object.freeze()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)

- [Object.isFrozen()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isFrozen)

- [Object.keys()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)

- [Object.values()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/values)

- [Object.getPrototypeOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/GetPrototypeOf)

- [Object.getOwnPropertyNames()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames)

- [Object.getOwnPropertyDescriptor()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)

- [Object.getOwnPropertyDescriptors()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors)

#### Object 的实例方法(定义在 Object.prototype 上的)

- [Object.prototype.hasOwnProperty()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty)

- [Object.prototype.isPrototypeOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isPrototypeOf)

- [Object.prototype.propertyIsEnumerable()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/propertyIsEnumerable)

- [Object.prototype.toString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)

- [Object.prototype.valueOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf)

## 对象的分类

我们通常自己定义和使用的对象，只是特定的一部分，并不能涵盖全部的 JavaScript 对象。

例如，我们不论怎样编写代码，都没法绕开 Array，自己实现一个跟原生的数组行为一模一样的对象，这是由于原生数组的底层实现了一个自动随着下标变化的 length 属性。

再如，在浏览器环境中，我们也无法单纯依靠 JavaScript 代码实现 div 对象，只能靠 document.createElement 来创建。

上面两个例子都说明了 JavaScript 的对象机制并非简单的属性集合 + 原型。

我们可以把对象分为以下几类：

- 宿主对象（host Objects）：由 JavaScript 宿主环境提供的对象，它们的行为完全由宿主环境决定。
- 内置对象（Built-in Objects）：由 JavaScript 语言实现提供的对象，不依赖于宿主环境。
  - 固有对象（Intrinsic Objects）：由标准规定，随着 JavaScript 运行时创建而自动创建的对象实例。
  - 原生对象（Native Objects）：可以由用户通过 Array、RegExp 等内置构造器或者特殊语法创建的对象。
  - 普通对象（Ordinary Objects）：由 {} 语法，Object 构造器或者 class 关键字等定义类所创建的对象，它能够被原型继承。

### 宿主对象

JavaScript 宿主对象千奇百怪，前端最熟悉的是浏览器环境中的宿主。

浏览器环境中，全局对象是 window，window 上又有很多属性，如 document。实际上，全局对象 window 上的属性，一部分来自 JavaScript 语言，一部分来自浏览器环境。

JavaScript 标准中规定了全局对象属性，W3C 的各种标准中规定了 window 对象的其他属性。

宿主对象也分为固有的和用户可创建的两种，比如 document。createElement 就可以让用户自己创建一些 DOM 对象。

宿主也会提供一些构造器，比如我们可以使用 new Image 来创建 img 元素。

#### Global 对象

上面所说的浏览器环境的宿主对象 window，这个全局对象 window 上的属性一部分来自 JavaScript 语言。这一部分就是 ECMAScript 标准中的 Global（全局）对象。

Global 对象是 ECMAScript 中最特别的一个对象，因为不管从什么角度上看，这个对象都是不存在的。ECMAScript 中的 Global 对象在某种意义上是作为一个终极的“兜底对象”来定义的。换句话说，不属于任何其他对象的属性和方法，最终都是它的对象和方法。

所以，事实上没有全局变量和全局函数：所有在全局作用域中定义的属性和函数，都是 Global 对象的属性。例如 eval()、isNaN()、isFinite()、parseInt()、parseFloat() 等方法和 undefined、NaN、Infinity 属性。ECMAScript 虽然没有指出如何直接访问 Global 对象，但是在浏览器环境中都是将这个全局对象作为 window 对象的一部分加以实现。因此，在全局作用域中声明的所有变量和函数，就都成为了 window 对象的属性。

### 内置对象

#### 固有对象

固有对象是由标准规定，随着 JavaScript 运行时创建而自动创建的对象实例。固有对象在任何 JavaScript 代码执行前就已经被创建出来了，它们通常扮演着类似基础库的角色。“类”其实就是固有对象的一种。

ECMA 标准提供的固有对象表：[https://262.ecma-international.org/9.0/#sec-well-known-intrinsic-objects](https://262.ecma-international.org/9.0/#sec-well-known-intrinsic-objects)，里面含有 150+的固有对象，不过这个表格并不完整，有个获取全部 JavaScript 固有对象的小实验，能获取到 443 个固有对象（参见文末）。

#### 原生对象

JavaScript 中，能够通过语言本身的构造器创建的对象称作原生对象。在 JavaScript 标准中，提供了 30 多个构造器。通过这些构造器，我们可以用 new 运算符创建新的对象，所以把这些对象称作原生对象。

![](./images/oo1.png)

##### 原生对象也是“特权对象”

几乎所有这些构造器的能力都是无法用纯 JavaScript 代码实现的，他们也无法用 class/extend 语法继承。这些构造器创建的对象多数使用了私有字段，例如：

- Error: [[ErrorData]]
- Boolean: [[BooleanData]]
- Number: [[NumberData]]
- Date: [[DateValue]]
- RegExp: [[RegExpMatcher]]
- Symbol: [[SymbolData]]
- Map: [[MapData]]

这些字段使得原型继承方法无法正常工作。所以，可以认为，所有这些原生对象都是为了特定能力或者性能而设计出来的“特权对象”。

##### 包装对象

当使用原始类型的值（string、number、boolean），在调用对应属性和方法的时候，内部会自动转成对应的对象。隐式创建的这个对象，就成为包装对象（装箱转换）。

基本类型都有自己对应的包装对象 : String Number Boolean

**包装对象的特点**

- 隐式创建对象后，可以调用对应的属性和方法
- 使用后，立马销毁，所以不能给原始类型的值添加属性和方法

其过程举例：str.substring - > new String(1234) - > 找到 String 的 substring -> 将 new String 销毁

##### 特殊行为对象

在固有对象和原生对象中，有一些对象的行为跟正常对象有很大区别。它们常见的下标运算（就是使用中括号或者点来做属性访问）或者设置原型跟普通对象不同。

- Array：Array 的 length 属性根据最大的下标自动发生变化。
- Object.prototype：作为所有正常对象的默认原型，不能再给它设置原型了。
- String：为了支持下标运算，String 的正整数属性访问会去字符串里查找。
- Arguments：arguments 的非负整数下标属性跟对应的变量联动
- 模块的 namespace 对象：特殊的地方非常多，跟一般对象完全不一样，尽量只用于 import。
- 类型数组和数组缓冲区：跟内存块相关联，下标运算比较特殊。
- bind 后的 function：跟原来的函数相关联。

### 特殊的函数对象和构造器对象

在 JavaScript 中，还有一个看待对象的不同视角，有别于上面提到的一般分类的种类，是特殊的函数对象和构造器对象，即用对象模拟函数和构造器。

JavaScript 为这类对象预留了私有字段机制，并规定了抽象的函数对象与构造器对象的概念。

- 函数对象的定义：具有[[call]]私有字段的对象
- 构造器对象的定义： 具有[[construct]]私有字段的对象

#### 函数对象

JavaScript 用对象模拟函数的设计代替了一般编程语言中的函数，它们可以像其他语言的函数一样被调用、传参。任何宿主只要提供了“具有[[call]]私有字段的对象”，就可以被 JavaScript 函数调用语法支持。可以认为，任何对象只需要实现[[call]]，它就是一个函数对象，可以作为函数被调用。

> [[call]]私有字段必须是一个引擎中定义的函数，需要接受 this 值和调用参数，并且会产生作用域的切换。

#### 构造器对象

任何对象只需要实现[[construct]]，它就是一个构造器对象，可以作为构造器被调用。

#### 实际使用

##### 宿主和内置对象的实现

对于**为 JavaScript 提供运行环境的程序员**来说，只要字段符合，宿主对象和内置对象（如 Symbol 函数）就可以模拟函数和构造器。

对于宿主和内置对象来说，他们实现[[call]]（作为函数被调用）和[[construct]]（作为构造器被调用）不总是一致的。比如内置对象 Date 在作为构造器调用时产生新的对象，作为函数时，则产生字符串。

```
console.log(typeof new Date) // object
console.log(typeof Date()) // string
```

而浏览器宿主环境中提供的 Image 构造器，则根本不允许被作为函数调用。

```
console.log(typeof new Image) // object
console.log(typeof Image()) // Uncaught TypeError: Failed to construct 'Image': Please use the 'new' operator, this DOM object constructor cannot be called as a function.
```

再比如基本类型（String、Number、Boolean）,它们的构造器被当做函数调用，则产生类型转换的效果。

还有在 ES6 之后 => 语法创建的函数仅仅是函数，它们无法被当做构造器使用。

```
new (a => 0) // Uncaught TypeError: (intermediate value) is not a constructor
```

##### 用户使用 function 实现

用户用 function 关键字创建的函数必定同时是函数和构造器。用户使用 function 语法或者 Function 构造器创建的对象来说[[call]] 和 [[construct]]都是执行同一段代码。不过，他们表现出来的行为效果却不相同。

```
function f() {
    return 1;
}
var v = f(); // 把f作为函数调用，v 的值是 1
var o = new f(), // 把f作为构造函数调用，o 的值是构造函数实例
```

它们的[[construct]]的执行过程大致如下：

- 以 Object.prototype 为原型创建一个新对象
- 以新对象为 this，执行函数的[[call]]
- 如果[[call]]的返回值是对象，那么，返回这个对象，否则返回第一步创建的新对象。

这样的规则造成了一个有趣的现象，有点类似于闭包。如果我们的构造器返回了一个新的对象，那么 new 创建的新对象就变成了一个构造函数之外完全无法访问的对象，这一定程度上可以实现“私有”。

```
function cls() {
    this.a = 100;
    return {
        getValue: () => this.a
    }
}
var o = new cls;
o.getValue(); // 100 , a 在外面永远无法访问到
```

## 面向对象

要想理解 JavaScript 对象，必须清空我们脑子里“基于类的面向对象”相关的知识，回到人类对对象的朴素认知和面向对象的语言无关基础理论，我们就能够理解 JavaScript 面向对象的设计思路了。（参考前面对象的定义）

首先我认为，JavaScript 是基于对象的语言，也是面向对象的语言。

JavaScript 标准对基于对象的定义时：语言和宿主的基础设施由对象来提供，并且 JavaScript 程序即是一系列互相通讯的对象集合。

JavaScript 也是面向对象的语言，JavaScript 可以模拟基于类的面向对象，也可以实现基于原型的面向对象。

JavaScript 的对象设计跟目前主流基于类的面向对象差异非常大（具有高度动态性，属性被设计成比别的语言更加复杂的形式，提高了抽象能力）。所以有人会觉得 JavaScript 不是面向对象。可事实上，JavaScript 的对象系统设计虽然特别，但是 JavaScript 提供了完全运行时的对象系统，这使得它可以模拟多数面向对象编程范式（包括基于类和基于原型），所以它也是正统的面向对象语言。

**JavaScript 语言标准也已经明确说明，JavaScript 是一门面向对象的语言，标准中能这样说，正式因为 JavaScript 的高度动态性的对象系统。所以我们应该在理解其设计思想的基础上充分挖掘它的能力，而不是机械地模仿其它语言。**

> 扩展：具有高度动态性，属性被设计成比别的语言更加复杂的形式，提高了抽象能力。这些特征解释了为什么在 JavaScript 对象里可以自由添加属性，在其他的语言中却不能和为什么 JavaScript（直到 ES6）有对象的概念，但是却没有像其他语言那样，有类的概念这两个问题。

### 编码思想

两种编程方式：

(1)、面向过程

(2)、面向对象

两者的区别：

面向过程：关注实现过程和每一步的实现细节。

面向对象：关注特征和功能。

### 面向对象编程

通俗点，用对象的思想写代码就是面向对象编程。

#### 基本特征

1、抽象：抓住核心问题（简单理解为抽出像的部分；将相同或表现与问题相关特征的内容提取出来。）
其核心：抽出、抽离，将相同的部分（可能会维护、会迭代、会扩展）的代码抽离出来形成一类

2、封装：就是将类的属性包装起来，不让外界轻易知道它内部的具体实现；只提供对外接口以供调用

3、继承：从已有对象上继承出新的对象

4、多态：一个对象的不同形态

#### 面向对象的好处

1. 代码的层次结构更清晰
2. 更容易复用
3. 更容易维护
4. 更容易扩展

### JavaScript 面向对象的形式

在不同的编程语言中，设计者也利用各种不同的语言特性来抽象描述对象。最成功的流派是使用“类”的方式来描述对象，这诞生了诸如 C++、Java 等流行的编程语言。这个流派叫做基于类的编程语言。

还有一种就是基于原型的编程语言，他们利用原型来描述对象，JavaScript 就是其中的代表。

“基于类”的编程提倡使用一个关注分类和类之间关系的开发模型。在这类语言中，总是现有类，再从类去实例化一个对象。类与类之间又可能会形成继承、组合等关系。类又往往与语言的类型系统整合，形成一定编译时的能力。

与此相对，“基于原型”的编程看起来更提倡程序员去关注一系列对象实例的行为，而后才去关心如何将这些对象划分到最近的使用方式相似的原型对象，而不是将他们分类。

基于原型和基于类都能够满足基本的复用和抽象需求，但是适用的场景不太相同。就像是一个更显得专业一些，另一个更直观一些，用在一些不那么正式的场合。例如：就像专业人士可能看到老虎的时候，喜欢用猫科豹属豹亚种来描述它，但是对一些那么正式的场合，用“大猫”描述它可能更接近直观的感受。

JavaScript 面向对象的形式可以说有两种：**基于原型的面向对象**和**模拟基于类的面向对象**。

“基于类”并非面向对象的唯一形态，如果我们把视线从“类”移开，JavaScript 当年选择的原型系统，就是一个非常优秀的抽象对象的形式。

早期的 JavaScript 程序员一般都有过使用 JavaScript“模拟面向对象”的经历，JavaScript 本身就是面向对象的，它并不需要模拟，只是它实现面向对象的方式和主流的流派不太一样，所以才让很多人产生了误会。前面所说的“模拟面向对象”，实际上做的事情是“模拟基于类的面向对象”。尽管，“类”并非面向对象的全部，但社区出现这样的方案也是有原因。

#### 为什么出现“模拟基于类的面向对象”这样的做法？

事实上，因为公司的一些政治原因，JavaScript 推出之时，管理层就要求它去模仿 Java，所以 JavaScript 创始人在“原型运行时”的基础上引入了 new、this 等语言特性，使之“看起来语法更像 Java”，而 Java 正式基于类的面向对象的代表语言之一。不过但是 JavaScript 模拟的并不全，缺少了继承等关键特性，导致大家试图对它进行修补，进而产生了种种互不相容的解决方案。

庆幸的是，从 ES6 开始，JavaScript 提供了 class 关键字来定义类，尽管，这样的方案仍然是基于原型运行时系统的类的模拟，但是它修正了之前的一些常见的“坑”，统一了社区的方案，这对语言的发展有着非常大的好处。

### 基于原型的面向对象

原型是顺应人类自然思维的产物，例如成语“照猫画虎”，这里的猫看起来就是虎的原型，所以可以看出，用圆形来描述对象的方法古已有之。

基于原型的面向对象系统通过“复制”的方式来创建新对象。一些语言的视线中，还允许复制一个空对象，来达到实际上创建一个全新的对象的目的。

JavaScript 并非第一个使用原型的语言，在它之前，self、kevo 等语言已经开始使用原型来描述对象了。事实上，JavaScript 最初的构想是一个拥有基于原型的面向对象能力的 scheme 语言。

在 JavaScript 之前，原型系统就更多与高动态语言配合，并且多数基于原型的语言提倡运行时的原型修改，这是 JavaScript 选择原型系统很重要的里有（JavaScript 是动态语言）。

原型系统的“复制操作”有两种实现思路：

- 一个是并不真的去复制一个原型对象，而是是的新对象持有一个原型的引用。（JavaScript 显然选择了这一种方式）
- 另一个是切实地复制对象，从此两个对象再无关联。

#### 原型系统

如果抛开 JavaScript 用于模拟 Java 类的复杂语法设施（如 new、Function、Object、函数的 prototype 属性等），原型系统简单到可以用两条概括：

- 所有对象都有私有字段[[prototype]]（即对象的原型）
- 读一个属性，如果对象本身没有，则会继续访问对象的原型，直到原型为空或者找到为止。

#### 利用原型实现抽象和复用

从 ES6 以来，JavaScript 提供了一系列内置函数，以便更为直接地访问操纵原型。三个方法分别为：

- Object.create：根据指定的原型创建新对象，原型可以是 null
- Object.getPrototypeOf：获得一个对象的原型
- Object.setPrototypeOf：设置一个对象的原型

利用这三个方法，我们可以完全抛开类的思维，利用原型来实现抽象和复用。

下面的代码展示了用原型来抽象猫和虎的例子。

```
var cat = {
    say() {
        console.log('meow~');
    },
    jump() {
        console.log('jump');
    }
}

var tiger = Object.create(cat, {
    say: {
        writable: true,
        configurable: true,
        enumerable: true,
        value: function () {
            console.log('roal');
        }
    }
})

var anotherCat = Object.create(cat);
anotherCat.say();
var anotherTiger = Object.create(tiger);
anotherTiger.say();
```

这段代码创建了一个“猫”对象，又根据猫做了一些修改创建了虎，之后我们完全可以用 Object.create 来创建另外的猫和虎对象，我们可以通过“原始猫对象”和“原始虎对象”来控制所有猫和虎的行为。

但是，在更早的版本中，程序员只能通过 Java 风格的类接口来操纵原型运行时，非常的别扭。

### 模拟基于类的面向对象

考虑到 new 和 prototype 属性等基础设施今天仍然有效，并且被很多代码使用，学习这些知识也有助于我们理解运行时的原型工作原理。下面我们试着回到过去，追溯一下早年 JavaScript 中的原型和类。

#### 早期版本的类与原型

##### 早期版本的类只是一个私有属性，或者说运行时的一个字符串属性。

在早期版本的 JavaScript 中，“类”的定义时一个私有属性[[class]]，语言标准为内置类型的 Number、String、Date 等指定了[[class]]属性，用来表示它们的类。语言使用者唯一可以访问[[class]]属性的方式是 Object.prototype.toString。因此，在 ES3 和之前的版本，JavaScript 中类的概念是相当弱的，它仅仅是运行时的一个字符串属性。

从 ES5 开始，[[class]]私有属性被 Symbol.toStringTag 代替，Object.prototype.toString 的意义从命名上不再跟 class 相关。我们甚至可以用 Symbol.toStringTag 来自定义 Object.prototype.toString 的行为。

例一：展示一些内置 class 属性的对象

```
var o = new Object;
var n = new Number;
var s = new String;
var b = new Boolean;
var d = new Date;
var arg = function(){ return arguments}();
var r = new RegExp;
var f = new Function;
var arr = new Array;
var e = new Error;

console.log([o, n, s, b, d, arg, r, f, arr, e].map(v => Object.prototype.toString.call(v)));
// ["[object Object]", "[object Number]", "[object String]", "[object Boolean]", "[object Date]", "[object Arguments]", "[object RegExp]", "[object Function]", "[object Array]", "[object Error]"]
```

例二：自定义 Object.prototype.toString 的行为

```
var o = { [Symbol.toStringTag]: "myObject"};

console.log(o + ""); // "[object myObject]"
```

##### 理解原型对象

无论什么时候，只要创建了一个新函数，就会根据一组特定的规则为该函数创建一个 prototype 属性，这个属性指向函数的原型对象。在默认情况下，所有原型对象都会自动获得一个 constructor（构造函数）属性，这个属性是一个指向 prototype 属性所在函数的指针。

创建了自定义的构造函数后，其原型对象默认只会获得 constructor 属性；至于其他方法，则都是从 Object 继承而来的。当调用构造函数创建一个新实例后，该实例的内部将包含一个指针[[prototype]]（内部属性），指向构造函数的原型对象。因为是内部属性，[[prototype]]对脚本是完全不可见的（即不能直接访问）。ES6 之前在脚本没有标准的方式访问[[prototype]]，但 Firefox、Safari 和 Chrome 在每个对象上都支持一个属性 `__proto__`，可以间接访问。ES6 开始，有了标准的 Object.getPrototypeOf 方法，可以访问[[prototype]]。所以 ES6 之后，不建议再使用 `__proto__`。

要明确的重要的一点是：这个[[prototype]]内部属性连接了实例和构造函数的原型对象，而不是实例与构造函数。

###### 扩展

1、`__proto__`

属性原型链,实例对象与原型之间的连接，叫做原型链。

**对象身上只有 `__proto__` 构造函数身上有 prototype 也有 `__proto__`**

2、 constructor

返回创建实例对象的构造函数的引用,每个原型都会自动添加 constructor 属性,for..in..遍历原型是找不到这个属性的。

```
var a = new A();
console.log(a.constructor == A) //true
```

虽然原型的 constructor 属性有可能发生变化，改变 constructor 属性没有任何直接或明显的建设性目的（可能要考虑极端情况）。constructor 属性的存在仅仅是为了说明该对象是从哪儿创建出来的。如果重写了 constructor 属性，那么原始值就被丢失了。

#### new 是 JavaScript 面向对象的一部分

new 运算接受一个构造器和一组调用参数，实际上做了几件事：

- 以构造器的 prototype 属性（注意与私有字段[[prototype]]的区分）为原型，创建新对象；
- 将 this 和调用参数传给构造器，执行；
- 如果构造器返回的是对象，则返回，否则返回第一步创建的对象。

new 这样的行为，试图让函数对象在语法上跟类变得相似，但是，它客观上提供了两种方式，一是在构造器中添加属性，而是在构造器的 prototype 属性上添加属性。

**没有 Object.create、Object.setPrototypeOf 的早期版本中，new 运算符是唯一一个可以指定[[prototype]]的方法**（Mozilla 提供了私有属性 `__proto__` ，但是多数环境并不支持），所以，当时已经有人试图用它来实现后来的 Object.create，甚至可以用它来实现一个 Object.create 的不完整 ployfill。

```
Object.create = function (prototype) {
    var cls = function() {};
    cls.prototype = prototype;
    return new cls;
}
```

上面的代码实现的函数无法做到与现在原生的 Object.create 一致，一个是不支持第二个参数，另一个是不支持 null 作为原型，所以放到今天意义已经不大了。

#### 早期的面向对象——创建对象

##### 1、原始模式

假如我们有一个对象是狗的原型，这个原型有“名字”和“颜色”两个属性。

```
var Dog = {
    name: '',
    color: ''
}
```

根据这个原型对象，我们要生成一个实例对象如下

```
var hashiqi = {}; //创建空对象，之后根据原型对象的相应属性赋值
hashiqi.name = 'hashiqi';
hashiqi.color = 'blackandwhite';
```

**缺点：**
1、如果要生成多个实例对象，要重复写多次。
2、实例和原型之间没有联系。

扩展：如果我们要出创建多个相同类型的对象实例，像上面那样为每个实例单独进行属性分配，不仅繁琐，而且非常容易出错。这时我们肯定希望能够在一个地方将这些对象的属性和方法整合为一个类。这就是基于类的面向对象的起源。

##### 2、工厂模式

上面原始模式有一个缺点是要很麻烦的写很多重复的代码，我们可以写一个函数来解决代码重复的问题。

```
function Dog(name, color) {
    var obj = {};
    obj.name = name;
    obj.color = color;
    return obj;
}

var hashiqi = Dog('hashiqi', 'blackandwhite');
var jinmao = Dog('jinmao', 'yellow');
```

这种方式只是解决了代码重复的问题，但是生成的实例跟原型还是没有联系（即不知道创建的对象是什么类型的），而且`hashiqi`和`jinmao`也没有联系，不能反映出他们是同一个原型对象的实例。

##### 3、构造函数模式

用来创建对象的函数，叫做构造函数，其实就是一个普通函数，但是默认函数名首字母大写（借鉴其他的 OO 语言，主要是用来区别其他函数；因为构造函数本身也是函数，只不过可以用来创建对象而已），对构造函数使用 new 运算符，就能生成实例，并且 this 变量会绑定在实例对象上。

**ECMAScript 中的构造函数可用来创建特定类型的对象。创建自定义的构造函数意味着将来可以将它的实例标识为一种特定的类型，而这正是构造函数胜过工厂模式的地方**

```
function Dog(name, color) {
    this.name = name;
    this.color = color;
}

var hashiqi = new Dog('hashiqi', 'blackandwhite');
var jinmao = new Dog('jinmao', 'yellow');
console.log(hashiqi.name); //hashiqi
console.log(jinmao.name); //jinmao
```

hasiqi 和 jinmao 有一个共同的构造函数 `hashiqi.constructor === jinmao.constructor` 是 true

有以下几种方法可以验证原型对象与实例对象的关系：

```
hashiqi instanceof Dog; // true

Object.getPrototypeOf(hashiqi) === Dog.prototype // true

Dog.prototype.isPrototypeOf(hashiqi) // true
```

**缺点：**
构造函数解决了代码重复和实例与原型之间的联系，但是存在一个浪费内存的问题。比如原型对象有一些不变的属性和通用的方法，这样每生成一个实例，都必须为重复的东西多占一些内存（倒是可以使用全局变量和全局函数来解决生成的实例通用属性和方法浪费内存的问题，但这样又会创建的对象没有封装性）。好在，这些问题可以通过使用原型模式来解决。

> 扩展

我们可以尝试实现 new 运算符的逻辑如下：

```
function New(func) {
    var obj = {};

    //判断构造函数是否存在原型，如果有实例的__proto__属性就指向构造函数的prototype
    if(func.prototype !== undefined) {
        obj.__proto__ = func.prototype;
    }

    // 模拟出构造函数内部this指向实例的过程，注意，我们会拿到构造函数的返回值
    var res = func.apply(obj, Array.from(arguments).slice(1));

    // 正常构造函数是不需要显式声明返回值的，默认的返回值是生成的实例，但是一旦在构造函数中return 一个不是对象或者函数，就会改变构造函数的默认的返回值，其他的类型是不变的
    if(typeof res === 'object' && res !== null || typeof res === 'function') {
        return res;
    }

    return obj;
}

var taidi = New(Dog, 'taidi', 'gray');
```

**注意：**
正常的构造函数是不需要自己写 return 的，如果写了，当 return 的时候，如果是后面为简单类型，那么返回值还是构造函数生成的实例。如果 return 为对象类型或者函数，那么返回的就是 return 后面的这个对象或者函数。

##### 4、原型模式（prototype 模式）

每一个构造函数都有 `prototype` 属性，这个属性指向的是一个对象，这个对象的所有属性和方法，都会被构造函数的实例共享访问到。

基于这个属性，我们就可以有选择性的将一些通用的属性和方法定义到 `prototype` 上，每一个通过 `new` 生成的实例，都可以共享原型所包含的属性和方法，这样我们定义到构造函数原型对象的属性和方法，就会被每一个实例访问到，从而变成公用的属性和方法。

```
function Dog() {}

Dog.prototype.say = function () {
    console.log("汪汪");
}
Dog.prototype.jump = function () {
    console.log("jump");
}

var hashiqi = new Dog('hashiqi', 'blackandwhite');
var jinmao = new Dog('jinmao', 'yellow');

hashiqi.say(); // 汪汪
jinmao.say(); // 汪汪
console.log(hashiqi.say === jinmao.say); // true
```

**注意：当实例对象和原型对象有相同的属性或者方法时，会优先访问实例对象的属性或方法。**

###### 更简单的原型语法

为了避免每添加一个属性或方法就要敲一遍 Dog.prototype ，也为了从视觉上更好地封装原型的功能，更常见的做法是用一个包含所有共享属性和方法的对象字面量来重写整个原型对象。

```
function Dog() {}

Dog.prototype = {
    say: function () {
        console.log("汪汪");
    },
    jump: function () {
        console.log("jump");
    }
}

var hashiqi = new Dog('hashiqi', 'blackandwhite');
hashiqi.say(); // 汪汪
hashiqi.jump(); // jump
console.log(hashiqi instanceOf Dog) // true
console.log(hashiqi.constructor == Dog) // false
```

但是这么做有一个问题：constructor 属性不再指向 Dog 了。因为我们上面一段代码，本质上完全重写了默认的 prototype 对象，而重新赋值的对象字面量上又没有 constructor 属性，所以原型对象上没有了 constructor 属性，尽管 instanceOf 还能返回正确的结果，但已经无法通过 constructor 确定对象的类型了。

解决方式如下：

```
Dog.prototype = {
    constructor: Dog,
    say: function () {
        console.log("汪汪");
    },
    jump: function () {
        console.log("jump");
    }
}
```

以上代码特意包含了一个 constructor 属性，并将它的值设置为 Dog，从而确保了通过该属性能访问到适当的值。

但是又出现了一个新问题，以这种方式重设 constructor 属性会导致它的 enumerable 特征值被设置为 false。默认情况下，原生的 constructor 属性是不可枚举的，所以严格来说，constructor 需要用 Object.defineProperty。

```
Object.defineProperty(Dog.prototype, 'constructor', {
    enumerable: false,
    value: Dog
})
```

###### 原型具有动态性

由于每一次在原型中查找值的过程都会进行一次搜索，因此对原型对象所做的任何修改都能够立即从实例上反映出来——即使是先创建了实例后修改原型也照样如此。因为实例与原型对象之间的连接只不过是一个指针，而非一个副本。

尽管可以随时为原型添加属性和方法，并且修改能够立即在所有对象实例中反映出来，但是如果重写了整个原型对象，那么情况就不一样了。因为调用构造函数时会为实例添加一个指向最初原型的[[prototype]]指针，而把原型修改为另一个对象就等于切断了构造函数与最初原型之间的联系，所以要时刻记住：实例中的指针仅指向原型，而不指向构造函数。

###### 原型模式的问题

首先，它省略了为构造函数传递初始化参数这一环节，结果所有实例在默认情况下都将获得相同的属性值。虽然这会在某种程度上带来一些不方便，但还不是原型的最大问题。原型模式的最大问题是由其共享的本性所导致的。

原型中所有属性是被很多实例共享的，这种共享对于函数（或者说方法）非常合适。对于那些包含基本值的属性倒也说得过去，毕竟基本上影响最大的就是赋值，但是赋值相当于在实例上添加一个同名属性，可以隐藏原型中的对应属性。然而，对于包含引用类型的属性来说，问题就比较突出了，比如在某个实例上的属性数组的添加一个元素，所有的实例都会受到影响（除了可以共享一个数组的情况外）。所以，实例一般都是要有属于自己的全部属性的，而这个问题正是我们很少看到有人单独使用原型某事的原因所在。

##### 5、组合使用构造函数模式和原型模式

组合使用构造函数模式和原型模式是创建自定义类型最常见的方式。构造函数模式用于定义实例属性，而原型模式用于定义方法和共享的属性。每个实例都会有自己的一份实例属性的副本，但同时又共享着方法的引用，最大限度地节省了内存。另外，这种混成模式还支持向构造函数传参数。

```
function Dog(name, color) {
    this.name = name;
    this.color = color;
    this.nickname = ["beibei","lele"]
}

Dog.prototype = {
    constructor: Dog,
    say: function () {
        console.log("汪汪");
    },
    jump: function () {
        console.log("jump");
    }
}

var hashiqi = new Dog('hashiqi', 'blackandwhite');
var jinmao = new Dog('jinmao', 'yellow');

hashiqi.nickname.push("erha")

console.log(hashiqi.nickname) // ["beibei", "lele", "erha"]
console.log(jinmao.nickname) // ["beibei", "lele"]
```

修改 hashiqi.nickname 并不会影响到 jinmao.nickname ，因为他们分别引用了不同的数组。

这种构造函数与原型混成的模式，是目前在 ECMAScript 中使用最广泛、认同度最高的一种创建自定义类型的方法。可以说，这是用来定义引用类型的一种默认模式。

##### 6、寄生构造函数模式

通常，在前面的几种模式都不适用的情况下，可以使用寄生（parasitic）构造函数模式。这种模式的基本思想是创建一个函数，该函数的作用仅仅是封装创建对象的代码，然后再返回新创建的对象；

这个模式可以在特殊的情况下用来为对象创建构造函数。假设我们想创建一个具有额外方法的特殊数组，由于不能直接修改 Array 构造函数，因此可以使用这种模式。

```
function SpecialArray() {
    //创建数组
    var values = new Array();

    // 添加值
    values.push.apply(values,arguments);

    // 添加方法
    values.toPipedString = function () {
        return this.join("|");
    };

    // 返回数组
    return values;
}

var colors = new SpecialArray("red","yello","green")
console.log(colors.toPipedString()) // red|yello|green
```

关于寄生构造函数模式，有一点需要说明：首先，返回的对象与构造函数或者构造函数的原型属性之间没有关系；也就是说，构造函数返回的对象与在构造函数外部创建的对象没有什么不同，因此，不能依赖 instanceof 操作符来确定对象类型。由于存在上述问题，我们建议在可以使用其他模式的情况下，不要使用这种模式。

##### 7、稳妥构造函数模式

JavaScript 中稳妥对象（durable objects）指的是没有公共属性，而且其方法也不引用 this 的对象。

稳妥对象比较适合在一些安全的环境中（这些环境中会禁止使用 this 和 new），或者在防止数据被其他应用程序改动时使用。稳妥构造函数遵循与寄生构造函数类似的模式，但有两点不同：一是新创建对象的实例方法不引用 this，二是不使用 new 操作符调用构造函数。

```
function Person(name, age){
    // 创建要返回的对象
    var o = new Object();

    // 可以在这里定义私有变量和函数

    // 添加方法
    o.sayName = function () {
        alert(name);
    }

    // 返回对象
    return o;
}
```

注意，以上代码可以看出，在以这种模式创建的对象中，除了使用 sayName()方法外，没有其他方法访问 name 的值。即使有其他代码会给这个对象添加方法或数据成员，但也不可能有别的办法访问传入到构造函数中的原始数据。稳妥构造函数模式提供的这种安全性，使得它非常适合在某些安全执行环境下使用。

#### 早期面向对象——继承

继承（Inheritance）是代码复用的一种方式，并且有助于合理地组织程序代码。

许多面向对象语言都支持两种继承方式：接口继承和实现继承。接口继承只继承方法签名，而实现继承则继承实际的方法。我们知道，由于 JavaScript 函数没有签名，所以在 JavaScript 中无法实现接口继承（TS 可以）。JavaScript 只支持实现继承，而且其实现继承主要是依靠原型链实现的。

##### 原型链

JavaScript 中描述了原型链的概念，并将原型链作为实现继承的主要方法。其基本思想是利用原型让一个引用类型继承另一个引用类型的属性和方法。我们知道构造函数、原型和实例的关系：每个构造函数都有一个原型对象，原型对象都包含一个指向构造函数的指针 constructor，而实例都包含一个指向原型对象的内部指针[[prototype]]。那么，假如我们让原型对象等于另一个类型的实例，此时的原型对象将包含一个指向另一个原型的内部指针，相应地，另一个原型中也包含着一个指向另一个构造函数的指针。加入另一个原型又是另一个类型的实例，那么上述关系依然成立，如此层层递进，就构成了实例与原型的链条。这就是所谓原型链的基本概念。

在原型链中有几个点需要注意：

###### 1、别忘记默认原型

要记住，所有函数的默认原型都是 Object 的实例，因此默认原型都会包含一个内部指针，指向 Object.prototype。这也正是所有自定义类型都会继承 toString()、valueOf()等默认方法的根本原因。

###### 2、谨慎地定义方法

子类型有时候需要覆盖父类型中的某个方法，或者需要添加父类型中不存在的某个方法。但不管怎样，给原型添加方法的代码一定要放在替换原型的语句之后。

并且通过原型链实现继承时，不能使用对象字面量创建原型方法，因为这样做就会重写原型链。

```
// 继承了父类
SubType.prototype = new SuperType()

// 使用对象字面量添加新方法，会导致上一行代码无效
subType.prototype = {

}
```

###### 3、原型链的问题

原型链虽然很强大，可以用它来实现继承，但它也存在一些问题。其中，最主要的问题来自包含引用类型值的原型。之前介绍过，实例属性要在构造函数中定义，而不是在原型对象中定义，就是为了避免引用类型的属性值被所有实例共享，一个实例修改了属性，所有实例都会受到影响。在通过原型来实现继承时，原型实际上会变成另一个类型的实例。于是，原先的实例属性也就顺理成章地变成了现在的原型属性了。

原型链的第二个问题是：在创建子类型的实例时，不能向父类型的构造函数传递参数。实际上，应该说是没有办法在不影响所有对象实例的情况下，给父类型的构造函数传递参数。

基于上面提到的问题，实践中很少单独使用原型链实现继承。

##### 1、借用构造函数（经典继承）

在解决原型中包含引用类型值所带来问题的过程中，出现了借用构造函数技术（constructor stealing），有时候也叫做伪造对象或经典继承。这种技术的基本思想很简单，即在子类型构造函数的内部调用调用父类型构造函数。（函数只不过是在特定环境中执行代码的对象，因此通过使用 apply 和 call 方法也可以在（将来）新创建的对象上执行构造函数。）

使用 call 或 apply 方法，将父对象的构造函数绑定在子对象上。

```
//父类
function Animal() {
    this.species = '动物';
}

//子类
function Dog(name, color) {
    Animal.call(this);
    this.name = name;
    this.color = color;
}

var hashiqi = new Dog('hashiqi', 'blackandwhite');
console.log(hashiqi.species); //动物
```

###### 借用构造函数的问题

如果仅仅是借用构造函数，那么也将无法避免构造函数模式存在的问题——方法都在构造函数中定义，因此函数复用就无从谈起了。而且，在父类型的原型中定义的方法，对子类型而言也是不可见的。借用构造函数这种模式也很少单独使用。

##### 2、组合继承（伪经典继承）

组合继承（combination inheritance），有时也叫做伪经典继承，指的是将原型链和借用构造函数的技术组合到一块，发挥各自优势的一种继承模式。背后的思路是：使用原型链实现对原型属性和方法的继承，而通过借用构造函数来实现对实例属性的继承。这样，既通过在原型上定义方法实现了函数的复用，又能够保证每个实例都有它自己的属性。

```
function Animal(name) {
    this.name = name;
    this.nickname = ["beibei","lele"];
};
Animal.prototype.say = function () {
    console.log(this.name)
};
function Dog(name,color) {
    // 继承属性
    Animal.call(this,name)  // 第二次调用父类型
    this.color = color;
}

//继承方法
Dog.prototype = new Animal();  // 第一次调用父类型
//只要是prototype被完全覆盖，都得重写constructor。
Dog.prototype.constructor = Dog;
var hashiqi = new Dog('hashiqi', 'blackandwhite');
```

组合继承避免了原型链和借用构造函数的缺陷，融合了他们的优点，成为 JavaScript 中最常用的继承模式。

##### 3、原型式继承

这种方法并没有使用严格意义上的构造函数，思路是借助原型可以基于已有的对象创建新对象，同时还不必因此创建自定义类型。

```
function object(o) {
    function F() {}
    F.prototype = o;
    return new F()
}

var dog = {
    color: 'black',
    name: 'dog'
}

var hashiqi = object(dog)
hashiqi.name = 'hashiqi'
```

这种原型式继承，要求你必须有一个对象可以作为另一个对象的基础。如果有这么一个对象的话，可以把它传递给 object()函数，然后再根据具体需求对得到的对象加以修改即可。这其实就是基于原型的面向对象形式。

ES5 通过新增 Object.create()方法规范化了原型式继承。

```
var dog = {
    color: 'black',
    name: 'dog'
}

var hashiqi = Object.create(dog,{
    name: {
        value: "hashiqi"
    }
})
```

在没有必要兴师动众地创建构造函数，而只想让一个对象与另一个对象保持类似的情况下，原型式继承是完全可以胜任的。不过别忘了，包含引用类型值的属性始终都会共享相应的值，就像使用原型模式一样。

##### 3、原型式继承

###### 最原始的原型式继承

> 子类的 prototype 指向父类生成实例

```
function Animal() {};
Animal.prototype.species = '动物';
function Dog(name, color) {
    this.name = name;
    this.color = color;
}
Dog.prototype = new Animal();
//只要是prototype被完全覆盖，都得重写constructor。
Dog.prototype.constructor = Dog;
var hashiqi = new Dog('hashiqi', 'blackandwhite');
```

**缺点：** 每一次继承都得生成一个父类实例，比较占内存。

###### 利用 object()方法实现原型式继承

这种方法并没有使用严格意义上的构造函数，思路是借助原型可以基于已有的对象创建新对象，同时还不必因此创建自定义类型。

> 利用空对象作为中介

```
function object(o) {
    // 空对象几乎不占内存
    function F() {}
    F.prototype = o;
    return new F()
}

var dog = {
    color: 'black',
    name: 'dog'
}

var hashiqi = object(dog)
hashiqi.name = 'hashiqi'
```

这种原型式继承，要求你必须有一个对象可以作为另一个对象的基础。如果有这么一个对象的话，可以把它传递给 object()函数，然后再根据具体需求对得到的对象加以修改即可。这其实就是基于原型的面向对象形式。

###### Object.create()

ES5 通过新增 Object.create()方法规范化了原型式继承。

```
var dog = {
    color: 'black',
    name: 'dog'
}

var hashiqi = Object.create(dog,{
    name: {
        value: "hashiqi"
    }
})
```

在没有必要兴师动众地创建构造函数，而只想让一个对象与另一个对象保持类似的情况下，原型式继承是完全可以胜任的。不过别忘了，包含引用类型值的属性始终都会共享相应的值，就像使用原型模式一样。

##### 4、寄生式继承

寄生式（parasitic）继承是与原型式继承紧密相关的一种思路。寄生式继承的思路与寄生构造函数和工厂模式类似，即创建一个仅用于封装继承过程的函数，该函数在内部以某种方式来增强对象，最后再像真的是它做了所有工作一样返回对象。

```
function createAnother(original) {
    var clone = Object.create(original); //通过调用函数创建一个新对象
    clone.sayHi = function () {   //以某种方式来增强这个对象
        console.log("hi");
    };
    return clone;                 //返回这个对象
}

var person = {
    name: "Nicholas",
    friends: ["Shelby", "Court"]
}
var anotherPerson = createAnother(person)
anotherPerson.sayHi();
```

在主要考虑对象而不是自定义类型和构造函数的情况下，寄生式继承也是一种有用的模式。例子中的 Object.create 不是必须的；任何能够返回新对象的函数都是适用于此模式。

使用寄生式继承来为对象添加函数，会由于不能做到函数复用而降低效率。这一点与构造函数模式类似。

##### 5、寄生组合式继承

前面说过，组合继承时 JavaScript 最常用的继承类型，不过，它也有自己的不足。组合继承最大的问题就是无论什么情况下，都会调用两次父类型的构造函数：一次是在创建子类型原型的时候，另一次是在子类型构造函数内部。解决这个问题的方法就是——寄生组合式继承。

所谓寄生组合式继承，即通过借用构造函数来继承属性，通过原型链的混成形式来继承方法。其背后的基本思路是：不必为了指定子类型的原型而调用父类型的构造函数，我们所属要的无非就是父类型原型的一个副本而已。本质上，就是使用寄生式继承来继承父类型的原型，然后再将结果指定给子类型的原型。

```
function inheritPrototype(subType, superType) {
    var prototype = Object.create(superType.prototype)
    prototype.constructor = subType
    subType.prototype = prototype;
}

function SuperType(name) {
    this.name = name;
    this.colors = ["red","blue","green"]
}
SuperType.prototype.sayName = function() {
    console.log(this.name)
}
function SubType(name, age) {
    SuperType.call(this, name)
    this.age = age;
}
inheritPrototype(SubType, SuperType)
SubType.prototype.sayAge = function() {
    console.log(this.age)
}
```

这个例子的高效率体现在它只调用了一次 SuperType 构造函数，并且因此避免了在 SubType.prototype 上面创建不必要的，多于的属性。与此同时，原型链还能保持不变；因此，还能正常使用 instanceof 和 isPrototypeOf()。基本上普遍认为寄生组合式继承是引用类型最理想的继承范式。

### ES6 的 class——基于类的面向对象

上面所说的是 JavaScript 语言的传统方法，通过构造函数，定义并生成新的对象。而且因为从其它面向对象语言转向 JavaScript 的开发者来说，他们会更喜欢把 JavaScript 的继承系统简化，抽象化成他们更熟悉的形式，这就导致虽然 JavaScript 本身不支持经典的继承，但还是不可避免地进入类的范畴。为了解决类的问题，出现了一些模拟类的继承的 JavaScript 库。由于每个类库对类的实现都有不同的方式，ECMAScript 委员会对“模拟”基于类的继承语法进行了标准化，ES6 引入新的关键字 class，它提供了一种更为优雅的创建对象和实现继承的方式，底层仍然是基于原型的实现。class 只是语法糖，使得在 JavaScript 模拟类的代码更为简洁。

ES6 中提供了更接近传统语言的写法，引入了 Class(类)的概念，通过 class 关键字，可以定义类。new 和 function 搭配的怪异行为终于可以退休了（虽然运行时没有改变）。在任何场景，我都推荐使用 ES6 的语法来定义类，而令 function 回归原本的函数语义。

ES6 中引入了 class 关键字，并且在标准中删除了所有[[class]]相关的私有属性描述，类的概念正式从属性升级成语言的基础设施，从此，基于类的编程方式成为了 JavaScript 的官方编程语言。

#### 语法

ES6 的类完全可以看成是构造函数的另外一种写法。

```
var method = 'say';
class Dog {
    constructor (name,color) {
        this.name = name;
        this.color = color;
    }
    //注意，两个属性之间跟对象不同，不要加逗号，并且类的属性名可以使用变量或者表达式，如下
    [method] () {
        console.log('汪汪');
    }

    // Getter
    get dogName() {
        return this.showName();
    }

    // Method
    showName() {
        return this.name;
    }
}
console.log(typeof Dog); // function 类的数据类型就是函数
console.log(Dog === Dog.prototype.constructor); // true 类本身就是构造函数
```

在现有的类语法中，getter/setter 和 method 是兼容性最好的。可以通过 get/set 关键字来创建 getter/setter，通过括号和大括号来创建方法，数据型成员（属性）最好写在构造器里面。

既然是构造函数，所以在使用的时候，也是直接对类使用 new 命令，跟构造函数的用法完全一致。

```
var hashiqi = new Dog('hashiqi', 'blackandwhite');
console.log(hashiqi.color); // blackandwhite
console.log(hashiqi.dogName); // hashiqi

//上面采用表达式声明的类的属性可以用一下两种方式调用
hashiqi[method](); // 汪汪
hashiqi.say(); // 汪汪
```

##### 注意：

1、先声明定义类，再创建实例，否则会报错
`class` 不存在变量提升（不过存在预解析），这一点与 ES5 的构造函数完全不同

```
new Dog('hashiqi','blackandwhite')
class Dog {
    constructor (name,color) {
        this.name = name;
        this.color = color;
    }
}
//Uncaught ReferenceError: Dog is not defined
//上面代码，Dog类使用在前，定义在后，因为ES6不会把类的声明提升到代码头部，所以报错Dog没有定义。
```

2、必须使用 new 关键字来创建类的实例对象
_类的构造函数，不使用 new 是没法调用的，会报错。_ 这是它跟普通构造函数的一个主要区别，后者不用 new 也可以执行。

```
class Dog {
    constructor (name,color) {
        this.name = name;
        this.color = color;
    }
}
Dog(); // Uncaught TypeError: Class constructor Dog cannot be invoked without 'new'
```

3、定义“类”的方法（Method）的时候，前面不需要加上 function 这个关键字，直接把函数定义放进去就可以了。并且，方法之间不需要逗号分隔，加了会报错。

4、类的写法实际上也是由原型运行时来承载的，逻辑上 JavaScript 认为每个类都是有共同原型的一组对象，类中定义的方法则会被写在原型对象之上。

#### 属性概念

> constructor 构造函数

构造方法 constructor 是一个类必须要有的方法，默认返回实例对象；创建类的实例对象的时候，会调用此方法来初始化实例对象。如果你没有编写 constructor 方法，执行的时候也会被加上一个默认的空的 constructor 方法。

constructor 方法是必须的，也是唯一的，一个类体不能含有多个 constructor 构造方法。

```
class Dog {
    constructor (name,color) {
        this.name = name;
        this.color = color;
    }
    //定义了两个constructor，所以会报错
    constructor () {

    }
}
new Dog('hashiqi', 'blackandwhite')
//Uncaught SyntaxError: A class may only have one constructor
```

> Class 表达式

与函数一样，类可以使用表达式的形式定义。

```
const Hashiqi = class Dog {
    constructor (name,color) {
        this.name = name;
        this.color = color;
    }
    getName () {
        //此处的Dog就是Dog构造函数，在表达式形式中，只能在构造函数内部使用
        console.log(Dog.name);
    }
}
var hashiqi = new Hashiqi('hashiqi', 'blackandwhite'); // 真正的类名是Hashiqi
var jinmao = new Dog('jinmao', 'yellow'); // 会报错，Dog没有定义
```

通常我们的表达式会写成如下，省略掉类后面的名称

```
const Hashiqi = class {
    constructor (name,color) {
        this.name = name;
        this.color = color;
    }
}
var hashiqi = new Hashiqi('hashiqi', 'blackandwhite');
```

> 实例方法和静态方法
>
> 实例化后的对象才可以调用的方法叫做实例方法。
>
> 直接使用类名即可访问的方法，称之为“静态方法”

类相当于实例的原型，所有在类中定义的方法，都会被实例继承。如果在一个方法前，加上 static 关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。

```
class Dog {
    constructor (name,color) {
        this.name = name;
        this.color = color;
    }
    static say () {
        console.log('汪汪');
    }
}
Dog.say(); //汪汪
```

**静态方法和实例方法不同的是：静态方法的定义需要使用 static 关键字来标识，而实例方法不需要；此外，静态方法通过类名来的调用，而实例方法通过实例对象来调用。**

#### 类的继承

> extends

类之间可以通过 extends 关键字实现继承，这比 ES5 的通过修改原型链实现继承，要清晰和方便很多。

```
class Dog extends Animal{}
```

**extends 的继承目标**
extends 关键字后面可以跟多种类型的值，有三种特殊情况

1、子类继承 Object 类

```
class A extends Object {}
console.log(A.__proto__ === Object) //true
//这种情况下，A其实就是构造函数Object的复制，A的实例就是Object的实例。
```

2、不存在继承

```
class A {}

console.log(A.__proto__ === Function.prototype) // true
console.log(A.prototype.__proto__ === Object.prototype) // true
//这种情况下，A作为一个基类（即不存在任何继承），就是一个普通函数，所以直接继承Funciton.prototype。
//但是，A调用后返回一个空对象（即Object实例），所以A.prototype.__proto__指向构造函数（Object）的prototype属性。

```

3、子类继承 null

```
class A extends null {}
console.log(A.__proto__ === Function.prototype) //true
console.log(A.prototype) //只有一个constructor属性，没有__proto__属性
这种情况与第二种情况非常像。A也是一个普通函数，所以直接继承Funciton.prototype。
但是，A调用后返回的对象不继承任何方法，所以没有__proto__这属性
```

> super

super 这个关键字，既可以当作函数使用，也可以当作对象使用。

1、super 作为函数调用时，代表父类的构造函数。作为函数时，super()只能用在子类的构造函数之中，用在其他地方就会报错。

2、super 作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类。

```
class Animal {
    constructor (name) {
        this.name = name;
        this.species = '动物';
    }
    say (){
        return this.species;
    }
}
class Dog extends Animal{
    constructor (name, color) {
        // 只要是自己在子类中定义constructor，必须调用super方法，否则新建实例会报错
        //super作为函数调用，只能用在子类的constructor中
        super(name);
        this.color = color;
    }
    getInfo () {
        //普通方法中，super指向父类的原型对象
        console.log(super.say()+': '+this.name +','+this.color);
    }
}
var hashiqi = new Dog('hashiqi', 'blackandwhite');
hashiqi.getInfo() //动物：hashiqi,balckandwhite
```

**注意：**
1、子类必须在 constructor 方法中调用 super 方法，否则新建实例时会报错。这是因为子类没有自己的 this 对象，而是继承父类的 this 对象，然后对其进行加工。如果不调用 super 方法，子类就得不到 this 对象。

2、在子类的普通方法中，由于 super 指向父类的原型对象，所以定义在父类实例上的方法或属性，是无法通过 super 调用的。

3、使用 super 的时候，必须显式指定是作为函数、还是作为对象使用，否则会报错。

## 控制对象

## 扩展

### 检测属性是否存在的方法汇总

#### in 运算符

in 运算符的左侧是属性名(字符串),右侧是对象。如果对象的自有属性或继承属性中包含这个属性则返回 true。

注意：in 运算符检查的属性名而非属性值，会查询原型链，而且不论属性是否可枚举。

```
var a = {b:1};
console.log('a' in window); // true 声明的全局变量'a'是window的属性
console.log('b' in a); // true 'b'是a的属性
console.log('toString' in a); // true a继承了toString属性
console.log('c' in a); // false 'c'不是a的属性
```

跟 in 运算符类似的，还可以用"!=="判断一个属性是否是 undefined，但是有一种场景只能使用 in 运算符，in 可以区分不存在的属性和存在但值为 undefined 的属性。

```
var a = {b:undefined};
console.log(a.b !== undefined); //false
console.log(a.c !== undefined); //false
console.log('b' in a); //true
console.log('c' in a); //false
```

#### hasOwnProperty

对象的`hasOwnProperty()`方法用来检测给定的名字是否是对象的自有属性，不论属性是否可枚举。**对于继承属性它将返回 false（即不会查询原型链）**

```
var a = {b:1};
console.log(a.hasOwnProperty('b')); //true
console.log(a.hasOwnProperty('c')); //false
console.log(a.hasOwnProperty('toString')); //false toString是继承属性
```

##### 扩展

因为普通对象的 hasOwnProperty 是继承自 Object.prototype 的，所以如果创建的普通对象切断了跟 Object.prototype 的原型链，就会导致对象无法使用该方法。

```
var a = Object.create(null)
a.name = '123';
a.hasOwnProperty("name") // Uncaught TypeError: a.hasOwnProperty is not a function
Object.prototype.hasOwnProperty.call(a, "name") // true
```

#### propertyIsEnumerable

对象的`propertyIsEnumerable()`方法只有检测到是自身属性(不包括继承的属性，不会查询原型链)且这个属性的可枚举性为 true 时它才返回 true。

```
var a = {b:1};
Object.defineProperty(a, 'c', {
    enumerable: false,
    value: 2
})
Object.setPrototypeOf(a, {d: 3})
console.log(a.propertyIsEnumerable('b')); // true
console.log(a.propertyIsEnumerable('c')); // false 不可枚举的自身属性
console.log(a.propertyIsEnumerable('d')); // false 可枚举的继承属性
```

### 遍历属性的方法汇总

#### for...in

for...in 会遍历当前对象及其原型链上的所有可枚举属性（获取当前对象及其原型链上的所有可枚举属性）。

#### Object.entries

Object.entries() 方法返回一个给定对象自身可枚举属性的键值对数组，其排列与使用 for...in 循环遍历该对象时返回的顺序一致（区别在于 for...in 循环还会枚举原型链中的属性）

#### Object.keys

获取当前对象上的所有可枚举属性。Object.keys 是获取对象属性的所有方法中范围最小的一种方法。

#### Object.getOwnPropertyNames

获取当前对象上的所有可枚举和不可枚举属性。

#### Object.getOwnPropertySymbols

获取当前对象上的所有 Symbol 属性。

#### Reflect.ownKeys

获取当前对象上的所有可枚举、不可枚举属性已经 Symbol 属性。所有可以理解为：Reflect.ownKeys = Object.getOwnPropertyNames + Object.getOwnPropertySymbols ，它是获取到对象属性的所有方法中范围最大的一种方法。

#### 总结

一般平时开发，如果只是想访问当前对象上的属性，可以使用 Object.keys，如果想访问当前对象以及其原型链上的属性最好使用 for...in 。因为如果对象的创建者在创建的时候故意将某个属性设置为 enumerable:false 或者用 Symbol 来设置属性，那么其本意应该是把这些属性当成对象的内部属性，不应该暴露给外部用户。

##### 注意

所有通过 Object 和 Reflect 方法获取对象的属性，都无法访问到原型链上的属性。

### 获取全部 JavaScript 固有对象

JavaScript 标准中可以找到全部的对象定义。JavaScript 语言规定的全局对象的属性如下：

三个值：

Infinity、NaN、undefined

九个函数：

eval、isFinite、isNaN、parseFloat、parseInt、decodeURI、decodeURIComponent、encodeURI、encodeURIComponent

一些构造器：

Array、Date、RegExp、Promise、Proxy、Map、WeakMap、Set、WeakSet、Function、Boolean、String、Number、Symbol、Object、Error、EvalError、RangeError、ReferenceError、SyntaxError、TypeError、URIError、ArrayBuffer、SharedArrayBuffer、DataView、Typed Array、Float32Array、Float64Array、Int8Array、Int16Array、Int32Array、Uint8Array、Uint16Array、Uint32Array、Uint8ClampedArray

四个用于当做命名空间的对象：

Atomics、JSON、Math、Reflect

我们使用广度优先搜索，查找这些对象所有的属性和 Getter/Setter，就可以获得 JavaScript 中所有的固有对象。

```
let set = new Set();
let objects = [
    eval,
    isFinite,
    isNaN,
    parseFloat,
    parseInt,
    decodeURI,
    decodeURIComponent,
    encodeURI,
    encodeURIComponent,
    Array,
    Date,
    RegExp,
    Promise,
    Proxy,
    Map,
    WeakMap,
    Set,
    WeakSet,
    Function,
    Boolean,
    String,
    Number,
    Symbol,
    Object,
    Error,
    EvalError,
    RangeError,
    ReferenceError,
    SyntaxError,
    TypeError,
    URIError,
    ArrayBuffer,
    SharedArrayBuffer,
    DataView,
    Float32Array,
    Float64Array,
    Int8Array,
    Int16Array,
    Int32Array,
    Uint8Array,
    Uint16Array,
    Uint32Array,
    Uint8ClampedArray,
    Atomics,
    JSON,
    Math,
    Reflect
];

objects.forEach(o => set.add(o));

for(var i = 0; i < objects.length; i++) {
    var o = objects[i]
    for(var p of Object.getOwnPropertyNames(o)) {
        var d = Object.getOwnPropertyDescriptor(o, p)
        if((d.value !== null && typeof d.value === 'object') || (typeof d.value === 'function') ) {
            if(!set.has(d.value))
                set.add(d.value), objects.push(d.value);
        }
        if(d.get) {
            if(!set.has(d.get))
                set.add(d.get), objects.push(d.get)
        }
        if(d.set) {
            if(!set.has(d.set))
                set.add(d.set), objects.push(d.set)
        }
    }
}
```

### 控制对象的访问（对象进阶，待整理，可以跟 Vue 一起）
