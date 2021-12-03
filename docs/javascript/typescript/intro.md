# TypeScript 介绍

### 强类型语言和弱类型语言的区别

#### 强类型语言

不允许改变变量的数据类型，除非进行强制类型转换。例如 Java

#### 弱类型语言

变量可以被赋予不同的数据类型。例如 JavaScript

### 静态类型语言和动态类型语言的区别

#### 静态类型语言

在编译阶段确定所有变量的类型

从内存的角度来看：

1. 编译阶段确定属性偏移量
2. 用偏移量访问代替属性名访问
3. 偏移量信息共享

#### 动态类型语言

在执行阶段确定所有变量的类型

从内存的角度来看：

1. 在程序运行时，动态计算属性偏移量
2. 需要额外的空间存储属性名
3. 所有对象的偏移量信息各存一份

### 一些语言的分类

| 分类   | 静态类型               | 动态类型        |
| ------ | ---------------------- | --------------- |
| 强类型 | Java、C#               | Python          |
| 弱类型 | C（稍弱）、C++（稍弱） | JavaScript、PHP |

### 类型检查

静态类型语言在编译时执行类型检查，而动态类型的语言在运行时执行类型检查。类型检查确保并强制你声明的变量的类型（常量，布尔值，数字，变量，数组，对象）与你指定的值相匹配。

当类型错误发生时，静态类型检查和动态类型检查之间的差异最为重要。在静态类型语言中，错误发生在编译步骤中，即在编译时会出现类型错误。在动态类型语言中，只有执行程序后才会出现错误。错误发生在运行时。

### 静态类型优势

1. **可以尽早发现 BUG 和错误**
   静态类型检查允许我们在程序没有运行之前就可以确定我们所设定的确定性是否是对的。一旦有违反这些既定规则的行为，它能在运行之前就发现，而不是在运行时。

2. **起到在线文档的功能**

3. **减少了复杂的错误处理**

4. **使你在重构时更有信心**
   更新了方法，并且相应地更新了类型定义，那么类型检查器将会帮我去捕获我遗漏的错误。

5. **将数据和行为分离**

6. **帮助我们消除了一整类 bug**

7. **减少单元测试的数量**

### 使用场景

1. 这段程序对你的业务非常关键

2. 随着需求的变化，这段程序很可能会被重构

3. 这段程序很复杂并且有许多活动组件

4. 这段程序有一个大团队的开发者维护，他们需要能够快速且准确地理解代码

## TypeScript

TypeScript 是 JavaScript 的超集，为 JavaScript 的生态增加了类型机制，并最终将代码编译为纯粹的 JavaScript 代码。即它是拥有类型系统的 JavaScript 的超集。

TypeScript 同样支持最新的 ECMAScript 标准，并能将代码根据需求转换为 ES 3 / 5 / 6，这也就意味着，开发者随时可以使用最新的 ECMAScript 特性，比如 module / class / spread operator 等，而无需考虑兼容性的问题。ECMAScript 所支持的类型机制非常丰富，包括：interface、enum、hybird type 等等。

目前主流的 IDE 都为 TypeScript 的开发提供了良好的支持，比如 Visual Studio / VS Code、Atom、Sublime 和 WebStorm。TypeScript 与 IDE 的融合，便于开发者实时获取类型信息。

使用 TypeScript 还可以增强重构能力，并且在对修改后的代码运行 TypeScript 编译器时，可以立即识别出重构后的代码哪里存在问题（例如 function 名字的更改）。

### TypeScript 受欢迎的 5 个原因

#### 1、对类型安全的诉求

无论在浏览器还是服务端，前端项目规模越来越大，越来越复杂。而规模越大，对静态类型语言的诉求就越强烈。

#### 2、严格遵守 ECMAScript 规范

TypeScript 选择改进 JavaScript，而不是取代它。学习 TypeScript 语法并不会增加额外成本。

#### 3、采用 Structural Typing（结构类型） 而不是 Nominal Typing（名义类型）

面向对象语言，一般会使用 Nominal Typin（名义类型），如 C++、Java、Swift，而函数式语言更习惯使用 Structural Typing（结构类型），如 OCaml、Haskell、Elm。在 JavaScript 中既可以使用面向对象，又可以使用函数式，但是开发者更倾向于使用函数式编程。TypeScript 选择使用结构类型，更符合 JavaScript 开发者的编程习惯。

关于 Structural Typing 和 Nominal Typing 的区别，可以看一下这篇文章：[《Type Systems: Structural vs. Nominal typing explained》](https://medium.com/@thejameskyle/type-systems-structural-vs-nominal-typing-explained-56511dd969f4)

#### 4、强大的开发工具

通过工具提高生产力才是 TypeScript 的核心。TypeScript 本身提供了非常棒的工具支持，TypeScript Server 机制是非常有创造性的。

#### 5、Open Source,Open Development

TypeScript 是用完全开源的方式来运营的，也就是说有关与 TypeScript 的一切，都是对开发者 100%透明的。通过 TypeScript 的 roadmap，可以清晰的看到具体哪些 bug 会被修复，哪些 feature 会被新增，以及所有关于这些技术点的讨论。这样拉近了核心开发团队与使用者的距离，让 TypeScript 的社区非常活跃。

### 使用 TypeScript 可能会存在的一些问题

#### TypeScript 并非健全的类型系统

- 健全

一个健全的类型系统能确保你的程序不会进入无效状态。例如，如果一个表达式的静态类型是 string，那么在运行时，对它求值你肯定只会得到一个 string。

在健全的类型系统中，永远不会在编译或**运行时**出现表达式与预期类型不匹配的情况。

- 不健全

TypeScript 具有一定程度的健全性，但 100% 的健全性不是它的目标。因为降低用户使用类型的认知开销比类型健全更重要。

> Apply a sound or "provably correct" type system. Instead, strike a balance between correctness and productivity.(应用一个健全或“正确无误”的类型系统（不是我们的目标）。相反，要在正确性和生产力之间取得平衡。)

```ts
interface A {
  x: number
}

let a: A = { x: 3 }
let b: { x: number | string } = a
b.x = 'unsound'
let x: number = a.x // 不健全，x 接受 number 类型，但此时 a.x 是 "unsound"

a.x.toFixed(0) // 运行时报错
```

上面的代码是不正确的，因为从 A 接口中可知 a.x 应该是一个数字。但是，经过一些重新赋值后，它最终以一个字符串的形式出现，并且后面的代码能通过编译，但会在运行时出错。

#### TypeScript 不保证任何运行时类型检查

#### 可怕的 any 类型

any 类型就是字面意思，编译器允许任何操作或赋值。人们习惯给花费时间超过 1 分钟的任何事物都来个 any 类型。any 的扩散会毁掉你类型系统的健全性。

```ts
;('oh my goodness' as any).ToFixed(1)
// 本来就不是一个 100% 健全的类型系统，如果加上 any 类型， TypeScript 会让你忘掉类型系统这回事。
```

### 总结

TypeScript 之所以能取得成功，很重要的一个原因就是定位明确：让 JavaScript 变得更好，而非取代。

TypeScript 不只是静态类型的 JavaScript，提高生产力才是 TypeScript 的核心目标。

## 推荐资料

- [为什么要在 javascript 中进行静态类型检查-静态类型的优点和缺点](https://www.jianshu.com/p/289b3c734a9f)
- [TypeScript 被吹过头了？](https://www.infoq.cn/article/hONCcNMIDZiVqzpxIK17)
- [未来可期的 TypeScript](https://mp.weixin.qq.com/s/a-k0HPU5pXzTvmByA8aS-g)
- [TypeScript 体系调研报告](https://mp.weixin.qq.com/s?__biz=MjM5MTA1MjAxMQ%3D%3D&mid=2651227148&idx=1&sn=36296746efb0cced763fdadcf6c45700#wechat_redirect)
