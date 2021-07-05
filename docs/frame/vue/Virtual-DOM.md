# Vue 中的 Virtual DOM

## 什么是 Virtual DOM

Virtual DOM 是将状态映射成视图的众多解决方案的其中一种，它的运作原理是使用状态生成虚拟节点，然后使用虚拟节点渲染视图。

## 为什么需要 Virtual DOM

### Virtual DOM vs 真实 DOM

#### 真实 DOM 操作肯定比现代框架封装的 Virtual DOM 慢？

https://www.zhihu.com/question/31809713

https://zhuanlan.zhihu.com/p/86153264

https://juejin.im/post/6844903902689656845

性能浪费

### 一定要用 Virtual DOM ?

Angular 脏检查流程

React 中使用 Virtual DOM

Vue 1.0 的细粒度绑定

Vue2.0 使用 Virtual DOM

### Virtual DOM 方案

Virtual DOM 的解决方式是通过状态生成一个虚拟节点树，然后使用虚拟节点树进行渲染。在渲染之前，会使用新生成的虚拟节点树和上一次生成的虚拟节点树进行对比，只渲染不同的部分。

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

### Vue.js 粒度与 Virtual DOM 结合
