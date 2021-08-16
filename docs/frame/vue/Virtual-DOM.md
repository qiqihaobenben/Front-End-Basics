# Vue 中的 Virtual DOM

## 什么是 Virtual DOM

Virtual DOM (虚拟 DOM)，是由普通的 JavaScript 对象来描述 DOM 对象，因为不是真实的 DOM 对象，所以叫 Virtual DOM。

Virtual DOM 是将状态映射成视图的众多解决方案的其中一种，它的运行原理是使用状态生成虚拟节点，然后使用虚拟节点渲染视图。

## 为什么需要 Virtual DOM

### Virtual DOM vs 真实 DOM

1. 尝试获取真实 DOM 包含的属性

```js
const element = document.querySelector('#app')
let s = ''
let index = 0
for (var key in element) {
  s += key + ','
  index++
}
console.log(s, index) // 通过index可知属性应该有200+
```

2. 如果使用 Virtual DOM 描述真实 DOM

```js
// 属性会很少
{
  sel: 'div',
  data: {},
  children: undefined,
  key: undefined,
  elm: undefined
}
```

从上面的对比可以明显看出，通过 Virtual DOM 创建的对象属性是非常少的，即创建一个 Virtual DOM 要比创建一个真实 DOM 成本要小很多。

#### 真实 DOM 操作肯定比现代框架封装的 Virtual DOM 慢？

[https://www.zhihu.com/question/31809713](https://www.zhihu.com/question/31809713)

[https://zhuanlan.zhihu.com/p/86153264](https://zhuanlan.zhihu.com/p/86153264)

[https://juejin.cn/post/6844903902689656845](https://juejin.cn/post/6844903902689656845)

需要从不同的场景具体分析，例如初始化渲染场景、小量数据更新的场景，大量数据更新的场景。没有任何框架可以比纯手动的优化 DOM 操作更快，框架考虑的是普适性或者说通用性，在不需要手动优化的情况下，提供过得去的性能，来避免性能浪费。

### 一定要用 Virtual DOM ?

Angular 脏检查流程

React 中使用 Virtual DOM

Vue 1.0 的细粒度绑定

Vue2.0 使用 Virtual DOM

为了简化 DOM 的复杂操作于是出现了各种 MVVM 框架，MVVM 框架解决了视图和状态的同步问题，然后为了简化视图的操作我们可以使用模板引擎，但是模板引擎没有解决跟踪状态变化的问题，于是 Virtual DOM 出现了。Virtual DOM 的好处是当状态改变时不需要立即更新 DOM，只需要创建一个虚拟树来描述 DOM，Virtual DOM 内部将弄清楚如何有效（diff）的更新 DOM。

### Virtual DOM 方案

Virtual DOM 的解决方式是通过状态生成一个虚拟节点树，然后使用虚拟节点树进行渲染（即维护程序的状态，跟踪上一次的状态）。在渲染之前，会使用新生成的虚拟节点树和上一次生成的虚拟节点树进行对比（diff），只渲染不同的部分（通过比较前后两次状态的差异更新真实 DOM）。

虚拟节点树是由组件树建立起来的整个虚拟节点（ Virtual Node，简写为 vnode）树。

## VNode

Vue.js 中存在一个 VNode 类，它可以实例化不同类型的 vnode 实例，而不同类型的 vnode 实例各自表示不同类型的真实 DOM 元素。

vnode 可以理解成节点描述对象，它描述了应该怎样去创建真实的 DOM 节点。

### vnode 类型

上面说到，vnode 是同一个 VNode 类实例化的对象，不同类型的 vnode 之间其实只是有效属性不同，因为当使用 VNode 类实例化创建一个 vnode 时 ，是通过参数为实例设置属性的，无效的属性会默认被赋值为 undefined 或 false.

#### 类型 1：注释节点

注释节点只有两个有效属性：text 和 isComment，其余属性全是默认的 undefined 或 false

```
# 一个真实的注释节点
<!--  这是一个注释节点 -->

# 对应的 vnode 如下
{
  text: "这是一个注释节点",
  isComment: true
}
```

#### 类型 2：文本节点

文本节点只有一个 text 属性

```
"Hello World!"

# 对应的 vnode 如下
{
  text: "Hello World!"
}
```

#### 类型 3：克隆节点

克隆节点是将现有节点的属性复制到新节点中，让新创建的节点和被克隆节点的属性保持一致，它的作用是优化静态节点和插槽节点。克隆节点和被克隆节点之间的唯一区别是：克隆节点的 isCloned 为 true，被克隆的原始节点的 isCloned 为 false。

例如静态节点，当组件内的某个状态发生变化后，当前组件会通过虚拟 DOM 重新渲染视图，静态节点因为它的内容不会改变，所以除了首次渲染需要执行渲染函数获取 vnode 之外，后续更新不需要执行渲染函数重新生成 vnode。因此，这时就会使用创建克隆节点的方法将 vnode 克隆一份，使用克隆节点进行渲染。这样就不需要重新执行渲染函数生成新的静态节点的 vnode，从而提升一定程度的性能。

#### 类型 4：元素节点

元素节点通常会存在以下四种有效属性：

- tag：节点的名称，例如 `p、ul、li、div`等
- data：节点上的数据，比如 `attrs、class、style`等
- children：当前节点的子节点列表
- context：当前组件的 Vue.js 实例

```
# 一个真实的元素节点
<p><span>Hello</span><span>World</span></p>

# 对应的 vnode 如下
{
  children: [VNode, VNode],
  context: {...},
  data: {...},
  tag: "p",
  ......
}
```

#### 类型 5：组件节点

组件节点和元素节点类似，不过有以下两个独有的属性：

- componentOptions：组件节点的选项参数，其中包含 `propsData、tag、children` 等信息。
- componentInstance：组件的实例，在 Vue.js 中，每个组件都是一个 Vue.js 实例。

```
# 一个组件节点
<child></child>

# 对应的 vnode 如下
{
  componentInstance: {...},
  componentOptions: {...},
  context: {...},
  data: {...},
  tag: "vue-component-1-child",
  ......
}
```

#### 类型 6：函数式组件

函数式组件和组件节点类似，不过有两个独有的属性：`functionalContext` 和 `functionalOptions`。

### Virtual DOM 执行流程

Vue.js 中通过模板来描述状态与视图之间的映射关系，所以它会先将模板编译成渲染函数，然后执行渲染函数生成虚拟节点，最后使用虚拟节点更新视图。Virtual DOM 在 Vue.js 中所做的是提供虚拟节点 vnode 和对新旧两个 vnode 进行对比，并根据对比结果进行 DOM 操作来更新视图。

## Virtual DOM 的作用

- 维护视图和状态的关系
- 复杂视图情况下提升渲染性能（需要考虑场景）
- 除了渲染成 DOM 以外，还可以实现 SSR（Nuxt.js/Next.js）、原生应用（Weex/React Native）、小程序（mpvue/uni-app）等。

## Virtual DOM 开源库——Snabbdom

### Snabbdom 特点

- Vue 2.x 内部使用的 Virtual DOM 就是改造的 Snabbdom
- 大约 200 行代码
- 通过模块可扩展
- 源码使用 TypeScript 开发
- 最快的 Virtual DOM 之一

### 常用模块

#### class

- 方便**动态切换** class
- 注意：给元素设置类是通过 sel 选择器

#### attributes

- 设置 DOM 元素的属性，使用 setAttribute()
- 能处理布尔类型的属性

#### props

- 跟上面的 attributes 模块相似，不过设置 DOM 元素的属性是用 element[attr] = value 的形式
- 不处理布尔类型的属性

#### dataset

- 设置 `data-*` 的自定义属性

#### style

- 设置行内样式，支持动画
- 增加了三个属性：delayed/remove/destroy

#### eventlisteners

- 注册和移除事件

### snabbdom 源码解析

先说一下如何学习源码：先宏观了解，然后带着目标看源码，看源码的过程中不要陷入细节，而是要不求甚解，可以配合调试理解源码的运行，并且可以参考必要的资料。
