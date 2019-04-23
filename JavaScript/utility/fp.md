## 函数式编程

### 什么是函数式编程？为何它重要？

#### 数学中的函数

```
f(x) = y
// 一个函数f，以x为参数，并返回输出y
```
关键点：

* 函数必须总是接受一个参数
* 函数必须总是返回一个值
* 函数应该依据接收到的参数（例如x）而不是外部环境运行
* 对于一个给定的x，只会输出唯一的一个y

函数式编程技术主要基于数学函数和它的思想，所以要理解函数式编程，先了解数学函数是有必要的。

### 函数式编程的定义

函数是一段可以通过其名称被调用的代码。它可以接受参数，并返回值。

与面向对象编程（Object-oriented programming）和过程式编程（Procedural programming）一样，函数式编程（Functional programming）也是一种编程范式。我们能够以此创建仅依赖输入就可以完成自身逻辑的函数。这保证了当函数被多次调用时仍然返回相同的结果（引用透明性）。函数不会改变任何外部环境的变量，这将产生可缓存的，可测试的代码库。


### 函数式编程具有以下特征

#### 1、引用透明性

所有的函数对于相同的输入都将返回相同的值，函数的这一属性被称为**引用透明性（Referential Transparency）**

```
// 引用透明的例子，函数identity无论输入什么，都会原封不动的返回
var identity = (i) => {return i}
```

##### 替换模型

把一个引用透明的函数用于其他函数调用之间。

`sum(4,5) + identity(1)`

根据引用透明的定义，我们可以把上面的语句换成：

`sum(4,5) + 1`

该过程被称为替换模型（Substitution Model）,因为函数的逻辑不依赖其他全局变量，你可以直接替换函数的结果，这与它的值是一样的。所以，这使得**并发代码**和**缓存**成为可能。

**并发代码：** 并发运行的时候，如果依赖了全局数据，要保证数据一致，必须同步，而且必要时需要锁机制。遵循引用透明的函数只依赖参数的输入，所以可以自由的运行。

**缓存：** 由于函数会为给定的输入返回相同的值，实际上我们就能缓存它了。比如实现一个计算给定数值的阶乘的函数，我们就可以把每次阶乘的结果缓存下来，下一次直接用，就不用计算了。比如第一次输入5，结果是120，第二次输入5，我们知道结果必然是120，所以就可以返回已缓存的值，而不必再计算一次。

#### 2、声明式和抽象

函数式编程主张声明式编程和编写抽象的代码。

##### 比较命令式和声明式

```
// 有一个数组，要遍历它并把它打印到控制台

/*命令式*/
var array = [1,2,3]
for(var i = 0; i < array.length; i++)
console(array[i]) // 打印 1,2,3

// 命令式编程中，我们精确的告诉程序应该“如何”做：获取数组的长度，通过数组的长度循环数组，在每一次循环中用索引获取每一个数组元素，然后打印出来。
// 但是我们的任务只是打印出数组的元素。并不是要告诉编译器要如何实现一个遍历。



/*声明式*/
var array = [1,2,3]
array.forEach((element) => console.log(element)) // 打印 1,2,3

// 我们使用了一个处理“如何”做的抽象函数，然后我们就能只关心做“什么”了
```

##### 函数式编程主张以抽象的方式创建函数，例如上文的forEach，这些函数能够在代码的其他部分被重用。



#### 3、纯函数

大多数函数式编程的好处来自于编写纯函数，纯函数是对给定的输入返回相同的输出的函数，并且纯函数不应依赖任何外部变量，也不应改变任何外部变量。

#### 纯函数的好处

1、纯函数产生容易测试的代码
2、纯函数容易写出合理的代码
3、纯函数容易写出并发代码
纯函数总是允许我们并发的执行代码。因为纯函数不会改变它的环境，这意味着我们根本不需要担心同步问题。
4、纯函数的输出结果可缓存
既然纯函数总是为给定的输入返回相同的输出，那么我们就能够缓存函数的输出。


## 高阶函数

### 数据和数据类型

程序作用于数据，数据对于程序的执行很重要。每种编程语言都有数据类型。这些数据类型能够存储数据并允许程序作用其中。

### JavaScript中函数是一等公民(First Class Citizens)

当一门语言允许函数作为任何其他数据类型使用时，函数被称为一等公民。也就是说函数可被赋值给变量，作为参数传递，也可被其他函数返回。

函数作为JavaScript的一种数据类型，由于函数是类似String的数据类型，所以我们能把函数存入一个变量，能够作为函数的参数进行传递。所以JavaScript中函数是一等公民。

### 高阶函数的定义

接受另一个函数作为其参数的函数称为高阶函数(Higher-Order-Function)，或者说高阶函数是接受函数作为参数并且/或者返回函数作为输出的函数。


### 抽象和高阶函数

一般而言，高阶函数通常用于抽象通用的问题，换句话说，高阶函数就是定义抽象。

**抽象** ： 在软件工程和计算机科学中，抽象是一种管理计算机系统复杂性的技术。 通过建立一个人与系统进行交互的复杂程度，把更复杂的细节抑制在当前水平之下。简言之，抽象让我们专注于预定的目标而无须关心底层的系统概念。

> 例如：你在编写一个涉及数值操作的代码，你不会对底层硬件的数字表现方式到底是16位还是32位整数有很深的了解，包括这些细节在哪里屏蔽。因为它们被抽象出来了，只留下了简单的数字给我们使用。

```
// 用forEach抽象出遍历数组的操作
const forEach = (array,fn) => {
  let i;
  for(i=0;i<array.length;i++) {
    fn(array[i])
  }
}

// 用户不需要理解forEach是如何实现遍历的，如此问题就被抽象出来了。
//例如，想要打印出数组的每一项
let array = [1,2,3]
forEach(array,(data) => console.log(data)) 
```

### 闭包和高阶函数

什么是闭包？简言之，闭包就是一个内部函数。什么是内部函数？就是在另一个函数内部的函数。

闭包的强大之处在于它对作用域链（或作用域层级）的访问。从技术上讲，闭包有3个可访问的作用域。
(1) 在它自身声明之内声明的变量
(2) 对全局变量的访问
(3) 对外部函数变量的访问（关键点）


**实例一**：假设你再遍历一个来自服务器的数组，并发现数据错了。你想调试一下，看看数组里面究竟包含了什么。不要用命令式的方法，要用函数式的方法来实现。这里就需要一个 tap 函数。

```
const tap = (value) => {
  return (fn) => {
    typeof fn === 'function' && fn(value)
    console.log(value)
  }
} 

// 没有调试之前
forEach(array, data => {
  console.log(data + data)
})

// 在 forEach 中使用 tap 调试
forEach(array, data => {
  tap(data)(() => {
    console.log(data + data)
  })
})
```

完成一个简单的reduce函数
```
const reduce = (array,fn,initialValue) => {
  let accumulator;
  if(initialValue != undefined)
    accumulator = initialValue
  else
    accumulator = array[0]

  if(initialValue === undefined)
    for(let i = 1; i < array.length; i++)
      accumulator = fn(accumulator, array[i])
  else
    for(let value of array)
      accumulator = fn(accumulator,value)
  return accumulator
}

console.log(reduce([1,2,3], (accumulator,value) => accumulator + value))
// 打印出6
```

## 柯里化与偏应用

### 一些概念

#### 一元函数

只接受一个参数的函数称为一元(unary)函数。

#### 二元函数

只接受两个参数的函数称为二元(binary)函数。

#### 变参函数

变参函数是接受可变数量的函数。

### 柯里化

柯里化是把一个多参数函数转换为一个嵌套的一元函数的过程。

例如
```
// 一个多参数函数
const add = (x,y) => x + y;
add(2,3)

// 一个嵌套的一元函数
const addCurried = x => y => x + y;
addCurried(2)(3)

// 然后我们写一个高阶函数，把 add 转换成 addCurried 的形式。
const curry = (binaryFn) => {
  return function (firstArg) {
    return function (secondArg) {
      return binaryFn(firstArg,secondArg)
    }
  }
}
let autoCurriedAdd = carry(add)
autoCurriedAdd(2)(3)
```

上面只是简单实现了一个二元函数的柯里化，下面我们要实现一个更多参数的函数的柯里化。

```
const curry = (fn) => {
  if (typeof fn !== 'function') {
    throw Error('No function provided')
  }
  return function curriedFn (...args) {
    // 判断当前接受的参数是不是小于进行柯里化的函数的参数个数
    if(args.length < fn.length) {
      // 如果小于的话就返回一个函数再去接收剩下的参数
      return function (...argsOther) {
        return curriedFn.apply(null, args.concat(argsOther))
      }
    }else {
      return fn.apply(null,args)
    }
  }
}

 const multiply = (x,y,z) => x * y * z;
 console.log(curry(multiply)(2)(3)(4))
```

柯里化的应用实例：从数组中找出含有数字的元素
```
let match = curry(function (expr,str) {
  return str.match(expr)
})
let hasNumber = match(/[0-9]+/)

let initFilter = curry(function (fn,array) {
  return array.filter(fn)
})

let findNumberInArray = initFilter(hasNumber)
console.log(findNumberInArray(['aaa', 'bb2', '33c', 'ddd', ]))
// 打印 [ 'bb2', '33c' ]
```

### 偏应用

我们上面设计的柯里化函数总是在最后接受一个数组，这使得它能接受的参数列表只能是从最左到最右。

但是有时候，我们不能按照从左到右的这样严格传入参数，或者只是想部分地应用函数参数。这里我们就需要用到偏应用这个概念，它允许开发者部分地应用函数参数。

```
const partial = function (fn, ...partialArgs) {
  return function (...fullArguments) {
    let args = partialArgs
    let arg = 0;
    for(let i = 0; i < args.length && arg < fullArguments.length; i++) {
      if(args[i] === undefined) {
        args[i] = fullArguments[arg++]
      }
    }
    return fn.apply(null,args)
  }
}
```

偏应用的示例：
```
// 打印某个格式化的JSON
let prettyPrintJson = partial(JSON.stringify,undefined,null,2)
console.log(prettyPrintJson({name:'fangxu',gender:'male'}))

// 打印出
{
  "name": "fangxu",
  "gender": "male"
}
```

## 组合与管道

### Unix的理念

1、每个程序只做好一件事情，为了完成一项新的任务，重新构建要好于在复杂的旧程序中添加新“属性”。
2、每个程序的输出应该是另一个尚未可知的程序的输入。
3、每一个基础函数都需要接受一个参数并返回数据。

### 组合(compose)

```
const compose = (...fns) => {
  return (value) => reduce(fns.reverse(),(acc,fn) => fn(acc), value)
}
```
compose 组合的函数，是按照传入的顺序从右到左调用的。所以传入的 fns 要先 reverse 一下，然后我们用到了reduce ，reduce 的累加器初始值是 value ，然后会调用 `(acc,fn) => fn(acc)`, 依次从 fns 数组中取出 fn ，将累加器的当前值传入 fn ，即把上一个函数的返回值传递到下一个函数的参数中。

组合的实例：
```
let splitIntoSpace = (str) => str.split(' ')
let count = (array) => array.length
const countWords = composeN(count, splitIntoSpace)
console.log(countWords('make smaller or less in amount'))
// 打印 6
```

### 管道/序列

compose 函数的数据流是从右往左的，最右侧的先执行。当然，我们还可以让最左侧的函数先执行，最右侧的函数最后执行。这种从左至右处理数据流的过程称为管道（pipeline）或序列(sequence)。

```
// 跟compose的区别，只是没有调用fns.reverse()
const pipe = (...fns) => (value) => reduce(fns,(acc,fn) => fn(acc),value)
```

## 函子

### 什么是函子(Functor)？

**定义**：函子是一个普通对象（在其它语言中，可能是一个类），它实现了map函数，在遍历每个对象值的时候生成一个新对象。

#### 实现一个函子

1、简言之，函子是一个持有值的容器。而且函子是一个普通对象。我们就可以创建一个容器（也就是对象），让它能够持有任何传给它的值。

```
const Container = function (value) {
  this.value = value
}

let testValue = new Container(1)
// => Container {value:1}
```

我们给 Container 增加一个静态方法，它可以为我们在创建新的 Containers 时省略 new 关键字。

```
Container.of = function (value) {
  return new Container(value)
}

// 现在我们就可以这样来创建
Container.of(1)
// => Container {value:1}
```

2、函子需要实现 map 方法，具体的实现是，map 函数从 Container 中取出值，传入的函数把取出的值作为参数调用，并将结果放回 Container。

> 为什么需要 map 函数，我们上面实现的 Container 仅仅是持有了传给它的值。但是持有值的行为几乎没有任何应用场景，而 map 函数发挥的作用就是，允许我们使用当前 Container 持有的值调用任何函数。

```
Container.prototype.map = function (fn) {
  return Container.of(fn(this.value))
}

// 然后我们实现一个数字的 double 操作
let double = (x) => x + x;
Container.of(3).map(double)
// => Container {value: 6}
```

3、map返回了一传入函数的执行结果为值的 Container 实例，所以我们可以链式操作。

```
Container.of(3).map(double).map(double).map(double)
// => Container {value: 24}
```

**通过以上的实现，我们可以发现，函子就是一个实现了map契约的对象。函子是一个寻求契约的概念，该契约很简单，就是实现 map 。根据实现 map 函数的方式不同，会产生不同类型的函子，如 MayBe 、 Either**

函子可以用来做什么？之前我们用tap函数来函数式的解决代码报错的调试问题，如何更加函数式的处理代码中的问题，那就需要用到下面我们说的MayBe函子

### MayBe 函子

让我们先写一个upperCase函数来假设一种场景

```
let value = 'string';
function upperCase(value) {
  // 为了避免报错，我们得写这么一个判断
  if(value != null || value != undefined)
    return value.toUpperCase()
}
upperCase(value)
// => STRING
```

如上面所示，我们代码中经常需要判断一些`null`和`undefined`的情况。下面我们来看一下MayBe函子的实现。

```
// MayBe 跟上面的 Container 很相似
export const MayBe = function (value) {
  this.value = value
}
MayBe.of = function (value) {
  return new MayBe(value)
}
// 多了一个isNothing
MayBe.prototype.isNoting = function () {
  return this.value === null || this.value === undefined;
}
// 函子必定有 map,但是 map 的实现方式可能不同
MayBe.prototype.map = function(fn) {
  return this.isNoting()?MayBe.of(null):MayBe.of(fn(this.value))
}

// MayBe应用
let value = 'string';
MayBe.of(value).map(upperCase)
// => MayBe { value: 'STRING' }
let nullValue = null
MayBe.of(nullValue).map(upperCase)
// 不会报错 MayBe { value: null }
```

### Either 函子

```
MayBe.of("tony")
  .map(() => undefined)
  .map((x)f => "Mr. " + x)
```

上面的代码结果是 `MyaBe {value: null}`,这只是一个简单的例子，我们可以想一下，如果代码比较复杂，我们是不知道到底是哪一个分支在检查 undefined 和 null 值时执行失败了。这时候我们就需要 Either 函子了，它能解决分支拓展问题。

```
const Nothing = function (value) {
  this.value = value;
}
Nothing.of = function (value) {
  return new Nothing(value)
}
Nothing.prototype.map = function (fn) {
  return this;
}
const Some = function (value) {
  this.value = value;
}
Some.of = function (value) {
  return new Some(value)
}
Some.prototype.map = function (fn) {
  return Some.of(fn(this.value));
}

const Either = {
  Some,
  Nothing
}

```

### Pointed 函子

函子只是一个实现了 map 契约的接口。Pointed 函子也是一个函子的子集，它具有实现了 of 契约的接口。 我们在 MayBe 和 Either 中也实现了 of 方法，用来在创建 Container 时不使用 new 关键字。所以 MayBe 和 Either 都可称为 Pointed 函子。

> ES6 增加了 Array.of， 这使得数组成为了一个 Pointed 函子。

### Monad 函子

MayBe 函子很可能会出现嵌套，如果出现嵌套后，我们想要继续操作真正的value是有困难的。必须深入到 MayBe 内部进行操作。
```
let joinExample = MayBe.of(MayBe.of(5));
// => MayBe { value: MayBe { value: 5 } }

// 这个时候我们想让5加上4，需要深入 MayBe 函子内部
joinExample.map((insideMayBe) => {
  return insideMayBe.map((value) => value + 4)
})
// => MayBe { value: MayBe { value: 9 } }
```

我们这时就可以实现一个 join 方法来解决这个问题。

```
// 如果通过 isNothing 的检查，就返回自身的 value
MayBe.prototype.join = function () {
  return this.isNoting()? MayBe.of(null) : this.value
}
```
```
let joinExample2 = MayBe.of(MayBe.of(5));
// => MayBe { value: MayBe { value: 5 } }

// 这个时候我们想让5加上4就很简单了。
joinExample2.join().map((value) => value + 4)
// => MayBe { value: 9 }
```

再延伸一下，我们扩展一个 chain 方法。
```
MayBe.prototype.chain = function (fn) {
  return this.map(fn).join()
}
```
调用 chain 后就能把嵌套的 MayBe 展开了。
```
let joinExample3 = MayBe.of(MayBe.of(5));
// => MayBe { value: MayBe { value: 5 } }


joinExample3.chain((insideMayBe) => {
  return insideMayBe.map((value) => value + 4)
})
// => MayBe { value: 9 }
```

**Monad** 其实就是一个含有 chain 方法的函子。只有of 和 map 的 MayBe 是一个函子，含有 chain 的函子是一个 Monad。












## 总结

### JavaScript是函数式编程语言吗？

函数式编程主张函数必须接受至少一个参数并返回一个值，但是JavaScript允许我们创建一个不接受参数并且实际上什么也不返回的函数。所以JavaScript不是一种纯函数语言，更像是一种多范式的语言，不过它非常适合函数式编程范式。




## 补充

### 1、纯函数是数学函数

```
function generateGetNumber() {
  let numberKeeper = {}
  return function (number) {
    return numberKeeper.hasOwnProperty(number) ? 
    number : 
    numberKeeper[number] = number + number
  }
}
const getNumber = generateGetNumber()
getNumber(1)
getNumber(2)
……
getNumber(9)
getNumber(10)

// 此时numberKeeper为：
{
  1: 2
  2: 4
  3: 6
  4: 8
  5: 10
  6: 12
  7: 14
  8: 16
  9: 18
  10: 20
}
```
现在我们规定，getNumber只接受1-10范围的参数，那么返回值肯定是 numberKeeper 中的某一个 value 。据此我们分析一下 getNumber ,该函数接受一个输入并为给定的范围（此处范围是10）映射输出。输入具有强制的、相应的输出，并且也不存在映射两个输出的输入。

下面我来再看一下数学函数的定义（维基百科）
>在数学中，函数是一种输入集合和可允许的输出集合之间的关系，具有如下属性：每个输入都精确地关联一个输出。函数的输入称为参数，输出称为值。对于一个给定的函数，所有被允许的输入集合称为该函数的定义域，而被允许的输出集合称为值域。

根据我们对于 getNumber 的分析，对照数学函数的定义，会发现完全一致。我们上面的getNumber函数的定义域是1-10，值域是2,4,6,……18,20



