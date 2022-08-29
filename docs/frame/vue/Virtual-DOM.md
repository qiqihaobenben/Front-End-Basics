# Vue 中的 Virtual DOM 和 diff 算法

## 什么是 Virtual DOM

Virtual DOM (虚拟 DOM)，是由普通的 JavaScript 对象来描述 DOM 对象，因为不是真实的 DOM 对象，所以叫 Virtual DOM。

Virtual DOM 是将状态映射成视图的众多解决方案的其中一种，它的运行原理是使用状态生成虚拟节点，然后使用虚拟节点渲染视图。

Vue.js 从 1.x 到 2.0 版本，最大的升级就是引入的 Virtual DOM，它为后续的服务端渲染以及跨端框架 Weex 提供了基础。

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

[网上都说操作真实 DOM 慢，但测试结果却比 React 更快，为什么？](https://www.zhihu.com/question/31809713)

[为什么说 JS 的 DOM 操作很耗性能](https://zhuanlan.zhihu.com/p/86153264)

[重新认识 Virtual DOM](https://juejin.cn/post/6844903902689656845)

需要从不同的场景具体分析，例如初始化渲染场景、小量数据更新的场景，大量数据更新的场景。没有任何框架可以比纯手动的优化 DOM 操作更快，框架考虑的是普适性或者说通用性，在不需要手动优化的情况下，提供过得去的性能，来避免性能浪费。

Virtual DOM 真正的价值不在于性能，而是：

1. 为函数式的 UI 编程方式打开了大门
2. 可以渲染到 DOM 以外的平台，比如 ReactNative

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

## diff 算法

为了尽可能减少在页面上频繁操作大规模的真实 DOM，需要在 Virtual DOM 中进行新旧 vnode 的比较，在比较的过程中对于差异的节点调用 DOM api 进行增删改等操作从而更新真实 DOM，这个过程就是 DOM diff，diff 的具体过程和原理就是 diff 算法。

一般 diff 两棵树，复杂度是 O(n^3)，这样的复杂度对于前端框架来说是不可接受的，所以前端框架的 dif 约定了两种处理原则：**只做同层的对比，type 变了就不再对比子节点。**

因为 DOM 节点做跨层级移动的情况还是比较少的，一般情况下都是同一层级的 DOM 的增删改，这样只要遍历，对比一下 type 就行了，是 O(n) 的复杂度，而且 type 变了就不再对比子节点，能省下一大片节点的遍历。另外，因为 Virtual DOM 中记录了关联的 DOM 节点，执行 DOM 的增删改也不需要遍历，是 O(1) 的复杂度，整体的 dff 算法复杂度就是 O(n)。

**diff 算法除了考虑本身的时间复杂度之外，还要做考虑 DOM 的操作次数，所以就要尽量复用节点，通过移动节点代替创建。**

Vue2 的 diff 流程图：

![](./images/v2diff.png)

### 简单 diff 算法

为了尽可能的复用节点，通常会根据 key 或者其他唯一标识符来进行检索，找到已经存在的节点，然后通过移动节点代替创建。

所以简单的 diff 算法就是遍历 newVnode 数组的每个节点，再遍历 oldVnode 数组，看中有没有对应的 key，有的话就移动到新的位置，没有的话再创建新的。目的是根据 key 复用 DOM 节点，通过移动节点而不是创建新节点来减少 DOM 操作。

### 双端 diff 算法

简单 diff 算法需要遍历 newVnode 数组 和 oldVnode 数组，双端 diff 有 4 个指针，分别指向新旧两个 vnode 数组的头尾。头和尾的指针向中间移动，直到 `oldStartIdx > oldEndIdx` 或者 `newStartIdx > newEndIdx`，说明处理完了所有符合的节点，剩余的节点可以直接添加或者删除。

每次对比 `sameVnode(oldStartVnode, newStartVnode)`、`sameVnode(oldEndVnode, newEndVnode)`、`sameVnode(oldStartVnode, newEndVnode)`、`sameVnode(oldEndVnode, newStartVnode)`，即两个头、两个尾，旧的头和新的尾，旧的尾和新的头。

#### 如果符合上面的某个判断，那么节点就是可以复用的

- 对于两个头和两个尾可以复用的节点就直接用 pathVnode 更新一下
- 旧的头和新的尾复用节点的时候，除了 pathVnode 更新外，还需要把旧的 DOM 移动到最后
- 旧的尾和新的头复用节点的时候，除了 pathVnode 更新外，还需要把旧的 DOM 移动到最前面

以上的操作完成后，4 个指针都是需要移动的

#### 如果双端都没有可复用的节点

需要在 oldVnode 数组中按照 key 来寻找

- 如果找到了，就把它放到 oldStartVnode.elm（真实 DOM 节点） 的前面，当前的 oldVnode 节点设置为 undefined
- 如果没找到（可能是根据 key 没找到，或者干脆没有 key），就新建一个节点，然后插入到 oldStartVnode.elm 之前

以上的操作完成后，newStartIdx 指针会移动

#### 符合条件的都处理完之后

- 如果 newVnode 数组有剩余，就会批量新增
- 如果 oldVnode 数组有剩余，就会批量递减

### Vue3 最长递增子序列

详见[Vue3 Diff —— 最长递增子序列](https://juejin.cn/post/6919376064833667080#heading-14)

## 推荐阅读

- [diff 算法深入一下？](https://mp.weixin.qq.com/s/HwowUwWA4pkSIQ1J4fwr9w)
- [聊聊 Vue 的双端 diff 算法](https://juejin.cn/post/7114177684434845727)
- [Vue 虚拟 DOM 和 Diff 算法源码解析](https://mp.weixin.qq.com/s/DsBHNWn6waaS13xX9AxJVA)
- [图解 Diff 算法——Vue 篇](https://mp.weixin.qq.com/s?__biz=Mzg3MDY2NTEyNg==&mid=2247487073&idx=1&sn=790580c3905876d3f380d6229693cfc4&scene=21#wechat_redirect)
- [React、Vue2、Vue3 的三种 Diff 算法](https://juejin.cn/post/6919376064833667080)
