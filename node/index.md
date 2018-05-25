## node环境下的相关操作 - 具体可参考  REPL 模块

    .help - 列出使用命令
    .break - 退出多行表达式
    .clear – 1、退出多行表达式	2、清除REPL运行环境的上下文对象中保存的所有变量和函数
    .exit – 退出REPL运行环境
    .save filename - 保存当前的 Node REPL 会话到指定文件
    .load filename - 载入当前 Node REPL 会话的文件内容

    ctrl + c：.break
    ctrl + c (两次)：.exit
    ctrl + d：.exit
    向上/向下 键 - 查看输入的历史命令
    tab 键 - 查看当前作用域下的所有可用的方法

*REPL(交互式解释器)*  
R  
	Read - 读取  
E  
	Eval - 运算  
P  
	Print - 打印输出  
L  
	Loop - 重复  
在REPL运行环境中使用下划线字符（“_”）来访问**最近使用的表达式**，但是不意味着可以改变变量的值

## 模块系统

* 作用：为了更好组织、管理代码，nodejs引入了模块

* 定义：一个文件就是一个独立的模块

* 特点：每个模块都有自己的独立作用域 - 模块作用域

* *扩展：作用域*
    1. 全局作用域
    2. 函数作用域
    3. 块级作用域（es2015+）
    4. 模块作用域

## Node.js核心模块

### 全局对象

全局对象global，其最根本的作用是作为一个全局变量的宿主。  
按照ECMAScript定义，满足以下条件的变量是全局变量：  
* 在最外层定义的变量
* 全局对象的属性
* 隐式定义的变量（未定义直接赋值的变量）
  
在Node.js中你不可能在最外层定义变量，因为所有用户代码都是输入当前模块的，而模块本身不是最外层上下文。  

> process: 用于描述当前Node.js进程状态的对象，提供了一个与操作系统的简单接口。

* process.argv  
process.argv 属性返回一个数组，这个数组包含了启动Node.js进程时的命令行参数。  
第一个元素为process.execPath。即Node.js进程的可执行文件所在的绝对路径  
第二个元素为当前执行的JavaScript文件路径。  
剩余的元素为其他命令行参数。
```
node index.js 1991 name=chenfangxu --v "lalla"

[ '/usr/local/Cellar/node/7.9.0/bin/node',
  '/Users/cfangxu/project/demo/myNEapp/site/index.js',
  '1991',
  'name=chenfangxu',
  '--v',
  'lalla' ]
```
  
* process.env：返回一个对象，成员为当前Shell的环境变量，比如process.env.HOME返回用户的主目录。
  
* process.platform：返回一个字符串，表示当前的操作系统，比如Linux。
  
  
#### 方法

* process.nextTick(callback)  
为事件循环设置一项任务，Node.js会在下次事件循环中调用callback（具体的时间点是：在当前执行栈的尾部、下一次Event Loop之前执行）。因为一个Node.js进程只有一个线程，因此在任何时刻都只有一个事件在执行。如果这个事件占用了大量的CPU时间，执行事件循环中的下一个事件就需要等待很久，因此Node.js的一个编程原则就是尽量缩短每个事件的执行时间。process.nextTick（）提供了一个这样的工具，可以把很复杂的工作拆散，编程一个个较小的事件。  

* process.chdir()：切换工作目录到指定目录。

* process.cwd()：返回运行当前脚本的工作目录的路径。

* process.exit([code])：退出当前进程。如果code未提供，此exit方法要么使用'success' 状态码 0，要么使用process.exitCode属性值，前提是此属性已被设置。 Node.js在所有['exit']事件监听器都被调用了以后，才会终止进程。  

<br />

> console:用于提供控制台标准输出

* console.log():向标准输出流打印字符并以换行符结束。

* console.error():向标准错误流输出

* console.trace(): 向标准错误流输出当前的调用栈

#### 重点说一下字符串替换(浏览器和Node.js有些不一样)

在字符串中使用占位符，并且用传递给该方法的其他参数替换占位符，从而完成字符串的替换。  

1. %s | 用字符串替换元素

2. %(d|i)| 用整数替换元素

3. %f | 用浮点数替换元素,使用%.1f可以将浮点数格式化为小数点后只保留一位有效数字。也可以使用 %.nf来指定小数点后保留n位数字。

4. %(o|O) | 元素作为一个对象来显示

5. %c | 应用提供的 CSS

* console.assert(value[, message][, ...args])  
一个简单的断言测试，验证 value 是否为真。 如果不为真，则抛出 AssertionError。 如果提供了 message，则使用 util.format() 格式化并作为错误信息使用。  
*注意*:Node.js 中的 console.assert() 方法与在浏览器中的 console.assert() 方法的实现是不一样的。  
具体地说，在浏览器中，用非真的断言调用 console.assert() 会导致 message 被打印到控制台但不会中断后续代码的执行。 而在 Node.js 中，非真的断言会导致抛出 AssertionError。  

<br/>

### util实用模块

提供常用函数的集合，用于弥补核心JavaScript的功能过于精简不足。

* util.format(format[, ...args])  
util.format() 方法返回一个格式化后的字符串，使用第一个参数作为一个类似 printf 的格式。  
第一个参数是一个字符串，包含零个或多个占位符。 每个占位符会被对应参数转换后的值所替换。 支持的占位符有：  
  * %s - 字符串。
  * %d - 数值（整数或浮点数）。
  * %i - 整数。
  * %f - 浮点数
  * %j - JSON。如果参数包含循环引用，则用字符串 '[Circular]' 替换。
  * %o - 一个对象的字符串，类似用util.inspect() 并且options { showHidden: true, depth: 4, showProxy: true }， 展示整个对象包括不可遍历的和symbol属性
  * %O - 一个对象的字符串 类似用util.inspect() 并且options为空 展示整个对象不包括不可遍历的和symbol属性
  * %% - 单个百分号（'%'）。不消耗参数。  

*注意*:  
```
只有一个参数，不会格式化，而是直接返回字符串。
util.format('%% %s'); // '%% %s'
```

* util.inspect(object[, options])  
* options
  * showHidden 如果为 true，则 object 的不可枚举的符号与属性也会被包括在格式化后的结果中。 默认为 false。
  * depth 指定格式化 object 时递归的次数。 这对查看大型复杂对象很有用。 默认为 2。 若要无限地递归则传入 null。
  * colors 如果为 true，则输出样式使用 ANSI 颜色代码。 默认为 false。 颜色可自定义。
  * customInspect 如果为 false，则 object 上自定义的 inspect(depth, opts) 函数不会被调用。 默认为 true。
  * showProxy 如果为 true，则 Proxy 对象的对象和函数会展示它们的 target 和 handler 对象。 默认为 false。
  * maxArrayLength 指定格式化时数组和 TypedArray 元素能包含的最大数量。 默认为 100。 设为 null 则显示全部数组元素。 设为 0 或负数则不显式数组元素。
  * breakLength 一个对象的键被拆分成多行的长度。 设为 Infinity 则格式化一个对象为单行。 默认为 60。

### 文件系统fs

fs模块是文件操作的封装，它提供了文件的读取、写入、更名、删除、遍历目录、链接等POSIX文件系统的操作。  
与其他模块不同，fs模块中大部分的操作都提供了异步的和同步的两个版本。  

*注意：* Node.js的异步编程接口习惯是以函数的最后一个参数为回调函数，通常一个函数只有一个回调函数。回调函数的实际参数中第一个是err，其余的参数是其他返回的内容。如果没有发生错误，err的值会是null或undefined,如果有错误发生，err通常是Error对象的实例。  

*注意：* 与同步I/O函数不同，Node.js中的异步函数大多没有返回值。

* fs.open方法中有参数mode，用于创建文件时给文件指定权限，默认为0o666。回调函数将会传递一个文件描述符fd。  
**文件权限：** 是POSIX操作系统中对文件读取和访问权限的规范，通常用一个八进制数来表示。例如0o754表示文件所有者的权限是7（读、写、执行），同组的用户权限是5（读，执行），其他用户的权限是4（读），写成字符表示就是 -rwxr-xr--。  
**文件描述符：** 是一个非负整数，表示操作系统内核为当前进程所维护的打开文件的记录表索引。  

<br />

### module

[可跳转JavaScript的模块#Node.js模块查看](./../JavaScript/utility/module)









