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

### Snabbdom 源码解析

先说一下如何学习源码：先宏观了解，然后带着目标看源码，看源码的过程中不要陷入细节，而是要不求甚解，可以配合调试理解源码的运行，并且可以参考必要的资料。

#### Snabbdom 核心

- 使用 h() 函数创建 JavaScript 对象（VNode）描述真实 DOM
- init() 设置模块，创建 patch()
- patch() 比较新旧两个 VNode
- 把变化的内容更新到真实 DOM 树上

#### h() 函数

h()函数最早见于 hyperscript，使用 JavaScript 创建超文本。Snabbdom 中的 h()函数不是用来创建超文本，而是创建 VNode。

h() 函数有函数重载的概念，函数重载是参数个数和类型不同的同一函数实现不同的逻辑，JavaScript 中没有重载，TypeScript 中有重载，不过重载的实现还是通过代码调整参数。

```ts
export function h(sel: string): VNode
export function h(sel: string, data: VNodeData | null): VNode
export function h(sel: string, children: VNodeChildren): VNode
export function h(
  sel: string,
  data: VNodeData | null,
  children: VNodeChildren
): VNode
export function h(sel: any, b?: any, c?: any): VNode {
  let data: VNodeData = {}
  let children: any
  let text: any
  let i: number

  if (c !== undefined) {
    // 三个参数的情况
    if (b !== null) {
      data = b
    }
    if (is.array(c)) {
      children = c
    } else if (is.primitive(c)) {
      text = c
    } else if (c && c.sel) {
      children = [c]
    }
  } else if (b !== undefined && b !== null) {
    // 两个参数的情况
    if (is.array(b)) {
      children = b
    } else if (is.primitive(b)) {
      text = b
    } else if (b && b.sel) {
      children = [b]
    } else {
      data = b
    }
  }
  if (children !== undefined) {
    for (i = 0; i < children.length; ++i) {
      if (is.primitive(children[i]))
        children[i] = vnode(
          undefined,
          undefined,
          undefined,
          children[i],
          undefined
        )
    }
  }
  if (
    sel[0] === 's' &&
    sel[1] === 'v' &&
    sel[2] === 'g' &&
    (sel.length === 3 || sel[3] === '.' || sel[3] === '#')
  ) {
    addNS(data, children, sel)
  }
  return vnode(sel, data, children, text, undefined)
}
```

#### VNode

```ts
export interface VNode {
  // 选择器
  sel: string | undefined
  // 节点数据：属性、样式、事件等
  data: VNodeData | undefined
  // 子节点，和 text 只能互斥
  children: Array<VNode | string> | undefined
  // 记录 vnode 对应的真实 DOM
  elm: Node | undefined
  // 节点中的内容，和 children 只能互斥
  text: string | undefined
  // 优化用
  key: Key | undefined
}

export function vnode(
  sel: string | undefined,
  data: any | undefined,
  children: Array<VNode | string> | undefined,
  text: string | undefined,
  elm: Element | Text | undefined
): VNode {
  const key = data === undefined ? undefined : data.key
  return { sel, data, children, text, elm, key }
}
```

#### VNode 渲染成真实 DOM

- patch(oldVnode, newVnode)
- 打补丁，把新节点中变化的内容渲染到真实 DOM，最后返回新节点作为下一次处理的旧节点

具体对比过程如下：

- 对比新旧 VNode 是否是相同节点（节点的 key 和 sel 相同）
- 如果不是相同节点，删除之前的内容，重新渲染
- 如果是相同节点，再判断新的 VNode 是否有 text，如果有并且和 oldVnode 的 text 不同，直接更新 文本内容
- 如果新的 VNode 有 children，判断子节点是否有变化，判断子节点的过程使用的就是 diff 算法
- diff 过程只进行同层比较

#### init() 返回 patch()

init 是高阶函数，内部返回 patch 函数，把 vnode 渲染成真实 DOM，并返回 VNode。

```ts
export function init(modules: Array<Partial<Module>>, domApi?: DOMAPI) {
  let i: number
  let j: number
  const cbs: ModuleHooks = {
    create: [],
    update: [],
    remove: [],
    destroy: [],
    pre: [],
    post: [],
  }
  // 初始化转换虚拟节点的 api
  const api: DOMAPI = domApi !== undefined ? domApi : htmlDomApi
  // 把传入的所有模块的钩子函数，统一存储到 cbs 对象中
  // 最终构建的 cbs 对象的形式 cbs = {create: [fn1, fn2], update: [], ... }
  for (i = 0; i < hooks.length; ++i) {
    // cbs.create = [], cbs.update = [] ...
    cbs[hooks[i]] = []
    for (j = 0; j < modules.length; ++j) {
      // modules 传入的模块数组
      // 获取模块中的 hook 函数
      // hook = modules[0][create] ...
      const hook = modules[j][hooks[i]]
      if (hook !== undefined) {
        // 把获取到的 hook 函数放入到 cbs 对应的钩子函数数组中
        ;(cbs[hooks[i]] as any[]).push(hook)
      }
    }
  }

  function emptyNodeAt(elm: Element) {
    // ……
  }

  function createRmCb(childElm: Node, listeners: number) {
    // ……
  }

  function createElm(vnode: VNode, insertedVnodeQueue: VNodeQueue): Node {
    // ……
  }

  function addVnodes(
    parentElm: Node,
    before: Node | null,
    vnodes: VNode[],
    startIdx: number,
    endIdx: number,
    insertedVnodeQueue: VNodeQueue
  ) {
    // ……
  }

  function invokeDestroyHook(vnode: VNode) {
    // ……
  }

  function removeVnodes(
    parentElm: Node,
    vnodes: VNode[],
    startIdx: number,
    endIdx: number
  ): void {
    // ……
  }

  function updateChildren(
    parentElm: Node,
    oldCh: VNode[],
    newCh: VNode[],
    insertedVnodeQueue: VNodeQueue
  ) {
    // ……
  }

  function patchVnode(
    oldVnode: VNode,
    vnode: VNode,
    insertedVnodeQueue: VNodeQueue
  ) {
    // ……
  }

  return function patch(oldVnode: VNode | Element, vnode: VNode): VNode {
    let i: number, elm: Node, parent: Node
    // 保存新插入节点的队列，为了触发钩子函数
    const insertedVnodeQueue: VNodeQueue = []
    // 执行模块的 pre 钩子函数
    for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]()

    // 如果 oldVnode 不是 VNode, 创建 VNode 并设置 elm
    if (!isVnode(oldVnode)) {
      // 把 DOM 元素转换成空的 VNode
      oldVnode = emptyNodeAt(oldVnode)
    }

    // 如果新旧节点是相同节点（key 和 sel 相同）
    if (sameVnode(oldVnode, vnode)) {
      // 找节点的差异并更新 DOM
      patchVnode(oldVnode, vnode, insertedVnodeQueue)
    } else {
      // 如果新旧节点不同，vnode 创建对应的 DOM
      // 获取当前的 DOM 元素
      elm = oldVnode.elm!
      parent = api.parentNode(elm) as Node
      // 创建 vnode 对应的 DOM 元素，并触发 init/create 钩子函数
      createElm(vnode, insertedVnodeQueue)

      if (parent !== null) {
        // 如果父节点不为空，把 vnode 对应的 DOM 插入到文档中
        api.insertBefore(parent, vnode.elm!, api.nextSibling(elm))
        // 移除老节点
        removeVnodes(parent, [oldVnode], 0, 0)
      }
    }
    // 执行用户设置的 insert 钩子函数
    for (i = 0; i < insertedVnodeQueue.length; ++i) {
      insertedVnodeQueue[i].data!.hook!.insert!(insertedVnodeQueue[i])
    }
    // 执行模块的 post 钩子函数
    for (i = 0; i < cbs.post.length; ++i) cbs.post[i]()
    // 返回 vnode
    return vnode
  }
}
```

#### createElm()

创建 vnode 对应的 DOM 元素，即给 vnode.elm 赋值，并触发 init/create 钩子函数

```ts
function createElm(vnode: VNode, insertedVnodeQueue: VNodeQueue): Node {
  let i: any
  let data = vnode.data
  if (data !== undefined) {
    // 执行用户设置的 init 钩子函数
    const init = data.hook?.init
    if (isDef(init)) {
      init(vnode)
      data = vnode.data
    }
  }
  // 把 vnode 转换成真实 DOM 对象（没有渲染到页面）
  const children = vnode.children
  const sel = vnode.sel
  if (sel === '!') {
    // 如果选择器是 ! ，创建注释节点
    if (isUndef(vnode.text)) {
      vnode.text = ''
    }
    vnode.elm = api.createComment(vnode.text!)
  } else if (sel !== undefined) {
    // 如果选择器不为空
    // 解析选择器
    // Parse selector
    const hashIdx = sel.indexOf('#')
    const dotIdx = sel.indexOf('.', hashIdx)
    const hash = hashIdx > 0 ? hashIdx : sel.length
    const dot = dotIdx > 0 ? dotIdx : sel.length
    const tag =
      hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel
    const elm = (vnode.elm =
      isDef(data) && isDef((i = data.ns))
        ? api.createElementNS(i, tag, data)
        : api.createElement(tag, data))
    if (hash < dot) elm.setAttribute('id', sel.slice(hash + 1, dot))
    if (dotIdx > 0)
      elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '))
    // 执行模块的 create 钩子函数
    for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode)
    // 如果 vnode 中有子节点，创建子 vnode 对应的 DOM 元素并追加到 DOM 树上
    if (is.array(children)) {
      for (i = 0; i < children.length; ++i) {
        const ch = children[i]
        if (ch != null) {
          api.appendChild(elm, createElm(ch as VNode, insertedVnodeQueue))
        }
      }
    } else if (is.primitive(vnode.text)) {
      // 如果 vnode 的 text 值是 string/number，创建文本节点并追加到 DOM 树
      api.appendChild(elm, api.createTextNode(vnode.text))
    }
    const hook = vnode.data!.hook
    if (isDef(hook)) {
      // 执行用户传入的钩子 create
      hook.create?.(emptyNode, vnode)
      if (hook.insert) {
        // 把 vnode 添加到队列中，为后续执行 insert 钩子做准备
        insertedVnodeQueue.push(vnode)
      }
    }
  } else {
    // 如果选择器为空，创建文本节点
    vnode.elm = api.createTextNode(vnode.text!)
  }
  // 返回新创建的 DOM
  return vnode.elm
}
```

![](https://cdn.jsdelivr.net/gh/qiqihaobenben/picture/2021-8-17/1629210680295-createElm.png)

#### removeVnodes()

```ts
function createRmCb(childElm: Node, listeners: number) {
  // 返回删除元素的回调函数
  return function rmCb() {
    if (--listeners === 0) {
      const parent = api.parentNode(childElm) as Node
      api.removeChild(parent, childElm)
    }
  }
}

function invokeDestroyHook(vnode: VNode) {
  const data = vnode.data
  if (data !== undefined) {
    // 执行用户设置的 destroy 钩子函数
    data?.hook?.destroy?.(vnode)
    // 调用模块中的 destroy 钩子函数
    for (let i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode)
    // 执行子节点的 destroy 钩子函数
    if (vnode.children !== undefined) {
      for (let j = 0; j < vnode.children.length; ++j) {
        const child = vnode.children[j]
        if (child != null && typeof child !== 'string') {
          invokeDestroyHook(child)
        }
      }
    }
  }
}

function removeVnodes(
  parentElm: Node,
  vnodes: VNode[],
  startIdx: number,
  endIdx: number
): void {
  for (; startIdx <= endIdx; ++startIdx) {
    let listeners: number
    let rm: () => void
    const ch = vnodes[startIdx]
    if (ch != null) {
      // 如果 sel 有值
      if (isDef(ch.sel)) {
        // 执行 destroy 钩子函数（会执行所有子节点的 destroy 钩子函数）
        invokeDestroyHook(ch)
        // listeners 保证模块的 remove 钩子函数都调用完毕后，才删除节点，避免重复删除
        listeners = cbs.remove.length + 1
        // 创建删除的回调函数
        rm = createRmCb(ch.elm!, listeners)
        for (let i = 0; i < cbs.remove.length; ++i) cbs.remove[i](ch, rm)
        // 执行用户设置的 remove 钩子函数
        const removeHook = ch?.data?.hook?.remove
        if (isDef(removeHook)) {
          removeHook(ch, rm)
        } else {
          // 如果没有用户钩子函数，直接调用删除元素的方法
          rm()
        }
      } else {
        // Text node
        // 如果是文本节点，直接调用删除元素的方法
        api.removeChild(parentElm, ch.elm!)
      }
    }
  }
}
```

#### addVnodes()

```ts
function addVnodes(
  parentElm: Node,
  before: Node | null,
  vnodes: VNode[],
  startIdx: number,
  endIdx: number,
  insertedVnodeQueue: VNodeQueue
) {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx]
    if (ch != null) {
      api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before)
    }
  }
}
```

#### patchVnode()

```ts
function patchVnode(
  oldVnode: VNode,
  vnode: VNode,
  insertedVnodeQueue: VNodeQueue
) {
  const hook = vnode.data?.hook
  // 首先执行用户设置的 prepatch 钩子函数
  hook?.prepatch?.(oldVnode, vnode)
  const elm = (vnode.elm = oldVnode.elm)!
  const oldCh = oldVnode.children as VNode[]
  const ch = vnode.children as VNode[]
  // 如果新旧 vnode 相同，直接返回
  if (oldVnode === vnode) return
  if (vnode.data !== undefined) {
    //  执行模块的 update 钩子函数
    for (let i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
    // 执行用户设置的 update 钩子函数
    vnode.data.hook?.update?.(oldVnode, vnode)
  }
  // 如果 vnode.text 未定义
  if (isUndef(vnode.text)) {
    if (isDef(oldCh) && isDef(ch)) {
      // 新旧节点都有 children，且不相等，调用 updateChildren()，使用 diff 算法，对比子节点，并且更新子节点的差异
      if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue)
    } else if (isDef(ch)) {
      // 只有新节点有 children 属性，如果旧节点有 text 属性，清空对应的 DOM 元素的 textContent，然后添加所有的子节点
      if (isDef(oldVnode.text)) api.setTextContent(elm, '')
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
    } else if (isDef(oldCh)) {
      // 只有旧节点有 children 属性，就移除旧节点的所有子节点
      removeVnodes(elm, oldCh, 0, oldCh.length - 1)
    } else if (isDef(oldVnode.text)) {
      // 只有旧节点有 text 属性， 清空对应 DOM 元素的 textContent
      api.setTextContent(elm, '')
    }
  } else if (oldVnode.text !== vnode.text) {
    // 新节点有 text 属性，且不等于旧节点的 text 属性
    // 如果旧节点有 children，移除旧节点 children 对应的 DOM 元素
    if (isDef(oldCh)) {
      removeVnodes(elm, oldCh, 0, oldCh.length - 1)
    }
    // 设置新节点对应 DOM 元素的 textContent
    api.setTextContent(elm, vnode.text!)
  }
  // 执行用户设置的 postpatch 钩子函数
  hook?.postpatch?.(oldVnode, vnode)
}
```

### 推荐阅读

[diff 算法深入一下？](https://mp.weixin.qq.com/s/HwowUwWA4pkSIQ1J4fwr9w)
