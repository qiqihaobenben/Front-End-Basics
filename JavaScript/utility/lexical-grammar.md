<!--
 * @Author: chenfangxu
 * @Date: 2020-12-20 11:30:46
 * @Description: JavaScript 词法
 * @LastEditors: chenfangxu
 * @LastEditTime: 2020-12-28 21:12:52
 * @FilePath: /front/JavaScript/utility/lexical-grammar.md
-->

# JavaScript 词法

文法是编译原理中对语言写法的一种规定，文法分为词法和语法。

词法的最小语义单元是：token，翻译为“标记”或“词”。从字符串到词的整个过程是没有结构的，只要符合词的规则，就构成词。词法分析技术上可以使用状态机或者正则表达式来进行。

一般来说，词法设计不会包含冲突。不过，JavaScript 中有一些特别之处：

- 除法和正则表达式冲突问题

同样是斜杠运算符`/`，`/` 和 `/=` 是除法运算符，但是两个斜杠括起来就是正则表达式 `/abc/`

- 字符串模板和 `}` 冲突问题

字符串模板语`Hello, ${name}`，理论上，`${}`内部可以放任何 JavaScript 代码，但是因为这些代码最后需要以`}`结尾，所以，这部分代码不允许出现`}`运算符，但是有例外情况：

```js
console.log(`Hello, ${function () {}}`)
```

## 输入分类

词法分析过程，JavaScript 源码文本会被从左到右扫描，并被转换成一系列输入元素：

- WhiteSpace 空白字符
- LineTerminator 换行符
- Comment 注释
- Token 词
  - IdentifierName 标识符名称，例如定义的变量名或关键字
  - Punctuator 符号，运算符和大括号等符号
  - NumbericLiteral 数字直接量，就是数字
  - StringLiteral 字符串直接量，就是直接用单引号或双引号引起来的字符串
  - Template 字符串模板，用反引号 ` 括起来的直接量

注：直接量（literal），就是程序中能直接使用的数据值。

## 空白符号 WhiteSpace

空白符提升了源码的可读性，并将 token 区分开。这些符号通常不影响代码的功能。在压缩代码的过程中会移除源码的空白，减少数据传输量。

| 编码   | 名称                          | 缩写                  | 说明                                                                                                                                     | 字符串中写法                    |
| ------ | ----------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| U+0009 | 缩进 TAB 符（制表符）         | `<HT>` 或 `<TAB>`     | 水平制表符                                                                                                                               | \t                              |
| U+000B | 垂直方向 TAB 符（垂直制表符） | `<VT>`                | 垂直制表符                                                                                                                               | \v                              |
| U+000C | 分页符                        | `<FF>`                | 分页符                                                                                                                                   | \f                              |
| U+0020 | 空格                          | `<SP>`                | 空格                                                                                                                                     |                                 |
| U+00A0 | 非断行空格                    | `<NBSP>`              | 文字排版中在该空格处不会换行                                                                                                             | HTML 中用 `&nbsp;` 生成的就是它 |
| U+200C | 零宽非连接符（ES5）           | `<ZWNJ>`              | 放置在一些经常被当成连字的字符之间，用于将他们分别以独立形式展示                                                                         |                                 |
| U+200D | 零宽连接符（ES5）             | `<ZWJ>`               | 放置在一些通常不会被标记为连字的字符之间，用于将这些字符以连字形式展示                                                                   |                                 |
| U+FEFF | 零宽非断行空格（ES5）         | `<ZWNBSP>`旧称`<BOM>` | 在以 UTF 格式编码的文件中，常常在文件首插入一个额外的 U+FEFF，解析 UTF 文件的程序可以根据 U+FEFF 的表示方法猜测文件采用哪种 UTF 编码方式 |                                 |

## 换行符 LineTerminator

除了空白符外，换行符也可以提高源码的可读性，不同的是，换行符还可以影响 JavaScript 代码的执行，也会影响自动分号补全的执行。

| 编码   | 名称     | 缩写   | 说明               | 字符串中写法 |
| ------ | -------- | ------ | ------------------ | ------------ |
| U+000A | 换行符   | `<LF>` | 正常的换行符       | \n           |
| U+000D | 回车符   | `<CR>` | 真正意义上的“回车” | \r           |
| U+2028 | 行分隔符 | `<LS>` |                    |              |
| U+2029 | 段分隔符 | `<PS>` |                    |              |

## 注释 Comment

注释用来在源码中增加提示、笔记、建议、警告等信息，可以帮助阅读和理解源码。在调试时，可以用来将一段代码屏蔽掉。

### 单行注释 single-line comment

使用 `//`，会将该行中符号以后的文本都视为注释，除了四种 LineTerminator 之外，所有字符都可以作为单行注释。

### 多行注释 multiple-line comment

使用 `/* */`，这种方式更加灵活，可以在单行内使用多行注释，当然可以实现多行的注释，甚至可以用在代码中当做行内注释（可读性会变差，谨慎使用）

多行注释中允许自由地出现 MultiLineNotAsteriskChar ，也就是除了 `*` 之外的所有字符。除了最后的结束位置，其他的任何 `*` 之后，不能出现正斜杠 `/`。

需要注意：多行注释中是否包含换行符号，会对 JavaScript 语法产生影响，对于 “no line terminator”规则来说，带换行的多行注释与换行符是等效的。

## 标识符名称 IdentifierName

IdentifierName 可以是 Identifier（就是我们自己定义的变量、函数）、NullLiteral（null 直接量）、BooleanLiteral 或者 keyword（关键字），在 ObjectLiteral 中，IdentifierName 还可以直接当做属性名称使用。仅当不是保留字时，IdentifierName 会被解析成 Identifier。

IdentifierName 可以以美元符`$`、下划线`_`、或者字母开始，除了开始字符以外，IdentifierName 中还可以使用连接标记、数字、以及连接符号。

JavaScript 中的一切都是区分大小写的，即关键字、变量、函数名和所有的标识符（Identifier）都要区分大小写。

### 关键字

关键字属于 IdentifierName ，这些关键字可用于表示控制语句的开始或结束，或者用于执行特定操作等。在 JavaScript 中，关键字有：

- await
- break
- case
- catch
- class
- const
- continue
- debugger
- default
- delete
- do
- else
- export
- extends
- finally
- for
- function
- if
- import
- in
- instanceof
- new
- return
- super
- switch
- this
- throw
- try
- typeof
- var
- void
- while
- with
- yield

为未来使用而保留的关键字

- enum

在严格模式下，还有一些额外的为了未来使用而保留的关键字

- implements
- interface
- package
- private
- protected
- public
- static

#### 关键字的使用

事实上关键字（保留字）是仅针对标识符（Identifier）的词法定义而言的，而不是标识符名（IdentifierName）的文法定义，例如下面的例子就不排斥关键字作为标识符名。

```
a = { import: "test" }
a.import
a["import"]
```

但是下面的就会报错，函数声明的标识符不能使用关键字

```
function import() {} // 报错
```

### 符号 Punctuator

因为前面提到的除法和正则问题， `/` 和 `/=` 两个运算符被拆封为 DivPunctuator，因为前面提到的字符串模板问题， `}` 也被独立拆分。加在一起，所有的符号为：

```

{ ( ) [ ] . ... ; , < > <= >= == != === !== + - * % ** ++ -- << >> >>> & | ^ ! ~ && || ? : = += -= *= %= **= <<= >>= >>>= &= |= ^= => / /= }
```

### 数字直接量 NumbericLiteral

JavaScript 规范中规定的数字直接量可以支持四种写法：十进制数、二进制整数、八进制整数和十六进制整数。

十进制的 Number 可以带小数，小数点前后部分都可以省略，但是能同时省略。

```
.01
12.
12.01

12.toString() // 因为 12. 会被当作省略了小数点后面部分的数字，而单独看成一个整体，就会报错
// 可以增加一个空格，让点单独成为一个 token，或者再加一个点。
12 .toString()
12..toString()
```

十进制数直接量还支持科学计数法，这里的 e 后面部分，只允许使用整数。

```
10.24E+2
10.24e-2
10.24e2
```

十进制数直接量可以以 0 开头，但是如果 0 以后的最高位比 8 小，数值将会被认为是八进制，不会报错，但得到的值可能不是期望的。

```
// 谨慎使用 0 开头的数值：
0888 // 转换为十进制 888
0777 // 转换为八进制 777，十进制 511
```

当以 0x 0b 0o 开头是，表示特定进制的整数，这几种进制都不支持小数，也不支持科学计数法。

```
0xFA  //十六进制整数
0o73  //八进制整数
0b10000 //二进制整数
```

### 字符串直接量 StringLiteral

字符串直接量支持单引号和双引号两种写法，区别仅仅是写法不同，在双引号字符串直接量中，双引号必须转义，在单引号字符串直接量中，单引号必须转义。字符串中其他必须转义的字符是 `\` 和所有的换行符。

JavaScript 中支持四种转义，**单字符转义**有特别意义的字符包括 SingleEscapeCharacter 定义的 9 中。此外还有数字、x 和 u。

```
// 十六进制转义序列
'\xA9' //"©"

// Unicode 转义序列
'\u00A9' //"©"

// Unicode 编码转义
'\u{2F804}' //"你"
```

### 正则表达式直接量 RegularExpressionLiteral

正则表达式由 Body 和 Flags 两部分组成：

```
/RegularExpressionBody/Flags
```

其中 Body 部分至少有一个字符，以避免当成是行注释符号。第一个字符不能是 `*` ，因为 `/*`跟多行注释有语法冲突。正则表达式有自己的语法规则，在词法阶段，仅会对它做简单解析。

### 字符串模板

模板就是一个有反引号括起来的，可以在中间插入代码的字符串。模板支持添加处理函数的写法，这时模板的各段会被拆开，传递给函数当参数：

```
function f(){
    console.log(arguments);
}

var a = "world"
var b = "ha"
f`Hello ${a}!${b}~`; //[["hello","!","~"],"word","ha"]

```

## [带注释的 ECMAScript 5.1 规范](http://es5.github.io/)

## 零宽非断行空格，零宽非连接符，零宽连接符的应用

1. 隐形水印（隐形指纹）
2. 加密信息分享
3. 逃脱敏感词过滤

以下几篇文章是详细介绍：

- [零宽度字符：和谐？屏蔽？不存在的](https://juejin.cn/post/6844903669192720391)
- [操作零宽字符的库](https://github.com/yuanfux/zero-width-lib)
- [使用零宽字符将用户名不可见的插入文本中](https://www.codesky.me/archives/be-careful-what-you-copy-invisibly-inserting-usernames-into-text-with-zero-width-characters.wind)
- [零宽字符的小 demo](https://www.umpox.com/zero-width-detection/)
