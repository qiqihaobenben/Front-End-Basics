<!--
 * @Author: chenfangxu
 * @Date: 2020-08-21 09:45:13
 * @Description: TypeScript 为何如此重要？（待翻译）
 * @LastEditors: chenfangxu
 * @LastEditTime: 2020-11-05 09:02:58
 * @FilePath: /front/article/translate/typescript-important.md
-->

# TypeScript 为何如此重要？

[TypeScript, why is so important?](https://www.warambil.com/typescript-why-is-so-important)

// TODO

## 类型为什么会存在？

众所周知的经典编程语言，例如：Pascal、C、C++等都是强类型语言，这就意味着这些语言，必须在编译时设置更严格的类型规则。

每次你声明变量或函数参数时，必须先明确标明它们的类型，然后再使用。这个概念背后的原因可以追溯到很久以前，即所谓的为了确保程序有意义的类型理论。

硬件无法区分类型。类型可以看作是人抽象出来的东西，可以让编程者实现更高层次的思考，让代码更加简洁明了。

此外，从编译器的角度来看，类型还有一些优势，例如：便于优化。在编译阶段进行类型检查可以让编译器更有效率的执行机器指令。安全是另一个重要的考量，强类型系统可以帮助编译器提早发现错误。

随着像是 Basic，JavaScript，PHP，Python 等解释型语言新秀的出现，它们都是在运行时进行类型检查。编程者可以不用编译它们的代码，语言变得更灵活智能，可以基于上下文和数据进行类型检测。

## 回归初心

大家不应该就关于强类型和弱类型孰优孰劣展开一场新争论，我们必须了解，每一种语言都是基于某个特定的目的被设计创造出来的，没有人会预料到像是 JavaScript 这样的脚本语言会如此流行并广泛的应用于开发商业应用。

给像 JavaScript 这样的弱类型语言增加强类型的能力，不仅可以帮助开发团队写出整洁的自解释代码，而且能解决一个根本问题：在运行时之前的编译阶段捕获类型错误。

## TypeScript 是什么？

JavaScript 是一个解释型或者说动态编译语言，开发人员在运行程序之前不需要编译代码。因为，我们称 TypeScript 为**JavaScript 的类型超集**，意思是说它给开发人员提供了一组新的语法，可以给 JavaScript 这种弱类型语言加入类型。

举个例子，当我们在 JavaScript 中声明一个变量时，是不需要指定类型的。但在 TypeScript 中声明变量就必须指定一个类型，当然你也可以不设置类型直接赋值。

```
let isDone: boolean
let decimal: number
let big: bigint
let color: string
let name = "John"
```

跟 JavaScript(.js)不同，TypeScript 文件后缀使用 .ts 扩展名。浏览器是不识别 .ts 文件，所以使用时必须提前把 TS 代码转换成 JavaScript 代码。这个转换过程被称为转译，编译和转译的微小差别在于：

- 编译是把源码转变成另一种语言
- 转译是把源码转变另一个相同抽象层级的语言

实话实说，我必须澄清这个概念，因为我已经有很多次碰到这两个容易被混淆的概念了。不过，为了便于阅读，就连 TypeScript 的官方文档也一直把预处理过程叫做编译。
