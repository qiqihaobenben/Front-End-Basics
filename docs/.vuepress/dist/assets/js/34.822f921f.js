(window.webpackJsonp=window.webpackJsonp||[]).push([[34],{398:function(t,a,e){t.exports=e.p+"assets/img/v2diff.bab8c359.png"},547:function(t,a,e){"use strict";e.r(a);var s=e(45),n=Object(s.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"vue-中的-virtual-dom-和-diff-算法"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#vue-中的-virtual-dom-和-diff-算法"}},[t._v("#")]),t._v(" Vue 中的 Virtual DOM 和 diff 算法")]),t._v(" "),s("h2",{attrs:{id:"什么是-virtual-dom"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#什么是-virtual-dom"}},[t._v("#")]),t._v(" 什么是 Virtual DOM")]),t._v(" "),s("p",[t._v("Virtual DOM (虚拟 DOM)，是由普通的 JavaScript 对象来描述 DOM 对象，因为不是真实的 DOM 对象，所以叫 Virtual DOM。")]),t._v(" "),s("p",[t._v("Virtual DOM 是将状态映射成视图的众多解决方案的其中一种，它的运行原理是使用状态生成虚拟节点，然后使用虚拟节点渲染视图。")]),t._v(" "),s("p",[t._v("Vue.js 从 1.x 到 2.0 版本，最大的升级就是引入的 Virtual DOM，它为后续的服务端渲染以及跨端框架 Weex 提供了基础。")]),t._v(" "),s("h2",{attrs:{id:"为什么需要-virtual-dom"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#为什么需要-virtual-dom"}},[t._v("#")]),t._v(" 为什么需要 Virtual DOM")]),t._v(" "),s("h3",{attrs:{id:"virtual-dom-vs-真实-dom"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#virtual-dom-vs-真实-dom"}},[t._v("#")]),t._v(" Virtual DOM vs 真实 DOM")]),t._v(" "),s("ol",[s("li",[t._v("尝试获取真实 DOM 包含的属性")])]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" element "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" document"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("querySelector")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'#app'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" s "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("''")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" index "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("for")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("var")]),t._v(" key "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("in")]),t._v(" element"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  s "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+=")]),t._v(" key "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("','")]),t._v("\n  index"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("++")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\nconsole"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("s"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" index"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 通过index可知属性应该有200+")]),t._v("\n")])])]),s("ol",{attrs:{start:"2"}},[s("li",[t._v("如果使用 Virtual DOM 描述真实 DOM")])]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 属性会很少")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  sel"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'div'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  data"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  children"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("undefined")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  key"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("undefined")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  elm"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("undefined")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("从上面的对比可以明显看出，通过 Virtual DOM 创建的对象属性是非常少的，即创建一个 Virtual DOM 要比创建一个真实 DOM 成本要小很多。")]),t._v(" "),s("h4",{attrs:{id:"真实-dom-操作肯定比现代框架封装的-virtual-dom-慢"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#真实-dom-操作肯定比现代框架封装的-virtual-dom-慢"}},[t._v("#")]),t._v(" 真实 DOM 操作肯定比现代框架封装的 Virtual DOM 慢？")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://www.zhihu.com/question/31809713",target:"_blank",rel:"noopener noreferrer"}},[t._v("网上都说操作真实 DOM 慢，但测试结果却比 React 更快，为什么？"),s("OutboundLink")],1)]),t._v(" "),s("p",[s("a",{attrs:{href:"https://zhuanlan.zhihu.com/p/86153264",target:"_blank",rel:"noopener noreferrer"}},[t._v("为什么说 JS 的 DOM 操作很耗性能"),s("OutboundLink")],1)]),t._v(" "),s("p",[s("a",{attrs:{href:"https://juejin.cn/post/6844903902689656845",target:"_blank",rel:"noopener noreferrer"}},[t._v("重新认识 Virtual DOM"),s("OutboundLink")],1)]),t._v(" "),s("p",[t._v("需要从不同的场景具体分析，例如初始化渲染场景、小量数据更新的场景，大量数据更新的场景。没有任何框架可以比纯手动的优化 DOM 操作更快，框架考虑的是普适性或者说通用性，在不需要手动优化的情况下，提供过得去的性能，来避免性能浪费。")]),t._v(" "),s("p",[t._v("Virtual DOM 真正的价值不在于性能，而是：")]),t._v(" "),s("ol",[s("li",[t._v("为函数式的 UI 编程方式打开了大门")]),t._v(" "),s("li",[t._v("可以渲染到 DOM 以外的平台，比如 ReactNative")])]),t._v(" "),s("h3",{attrs:{id:"一定要用-virtual-dom"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#一定要用-virtual-dom"}},[t._v("#")]),t._v(" 一定要用 Virtual DOM ?")]),t._v(" "),s("p",[t._v("Angular 脏检查流程")]),t._v(" "),s("p",[t._v("React 中使用 Virtual DOM")]),t._v(" "),s("p",[t._v("Vue 1.0 的细粒度绑定")]),t._v(" "),s("p",[t._v("Vue2.0 使用 Virtual DOM")]),t._v(" "),s("p",[t._v("为了简化 DOM 的复杂操作于是出现了各种 MVVM 框架，MVVM 框架解决了视图和状态的同步问题，然后为了简化视图的操作我们可以使用模板引擎，但是模板引擎没有解决跟踪状态变化的问题，于是 Virtual DOM 出现了。Virtual DOM 的好处是当状态改变时不需要立即更新 DOM，只需要创建一个虚拟树来描述 DOM，Virtual DOM 内部将弄清楚如何有效（diff）的更新 DOM。")]),t._v(" "),s("h3",{attrs:{id:"virtual-dom-方案"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#virtual-dom-方案"}},[t._v("#")]),t._v(" Virtual DOM 方案")]),t._v(" "),s("p",[t._v("Virtual DOM 的解决方式是通过状态生成一个虚拟节点树，然后使用虚拟节点树进行渲染（即维护程序的状态，跟踪上一次的状态）。在渲染之前，会使用新生成的虚拟节点树和上一次生成的虚拟节点树进行对比（diff），只渲染不同的部分（通过比较前后两次状态的差异更新真实 DOM）。")]),t._v(" "),s("p",[t._v("虚拟节点树是由组件树建立起来的整个虚拟节点（ Virtual Node，简写为 vnode）树。")]),t._v(" "),s("h2",{attrs:{id:"vnode"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#vnode"}},[t._v("#")]),t._v(" VNode")]),t._v(" "),s("p",[t._v("Vue.js 中存在一个 VNode 类，它可以实例化不同类型的 vnode 实例，而不同类型的 vnode 实例各自表示不同类型的真实 DOM 元素。")]),t._v(" "),s("p",[t._v("vnode 可以理解成节点描述对象，它描述了应该怎样去创建真实的 DOM 节点。")]),t._v(" "),s("h3",{attrs:{id:"vnode-类型"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#vnode-类型"}},[t._v("#")]),t._v(" vnode 类型")]),t._v(" "),s("p",[t._v("上面说到，vnode 是同一个 VNode 类实例化的对象，不同类型的 vnode 之间其实只是有效属性不同，因为当使用 VNode 类实例化创建一个 vnode 时 ，是通过参数为实例设置属性的，无效的属性会默认被赋值为 undefined 或 false.")]),t._v(" "),s("h4",{attrs:{id:"类型-1-注释节点"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#类型-1-注释节点"}},[t._v("#")]),t._v(" 类型 1：注释节点")]),t._v(" "),s("p",[t._v("注释节点只有两个有效属性：text 和 isComment，其余属性全是默认的 undefined 或 false")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v('# 一个真实的注释节点\n\x3c!--  这是一个注释节点 --\x3e\n\n# 对应的 vnode 如下\n{\n  text: "这是一个注释节点",\n  isComment: true\n}\n')])])]),s("h4",{attrs:{id:"类型-2-文本节点"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#类型-2-文本节点"}},[t._v("#")]),t._v(" 类型 2：文本节点")]),t._v(" "),s("p",[t._v("文本节点只有一个 text 属性")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v('"Hello World!"\n\n# 对应的 vnode 如下\n{\n  text: "Hello World!"\n}\n')])])]),s("h4",{attrs:{id:"类型-3-克隆节点"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#类型-3-克隆节点"}},[t._v("#")]),t._v(" 类型 3：克隆节点")]),t._v(" "),s("p",[t._v("克隆节点是将现有节点的属性复制到新节点中，让新创建的节点和被克隆节点的属性保持一致，它的作用是优化静态节点和插槽节点。克隆节点和被克隆节点之间的唯一区别是：克隆节点的 isCloned 为 true，被克隆的原始节点的 isCloned 为 false。")]),t._v(" "),s("p",[t._v("例如静态节点，当组件内的某个状态发生变化后，当前组件会通过虚拟 DOM 重新渲染视图，静态节点因为它的内容不会改变，所以除了首次渲染需要执行渲染函数获取 vnode 之外，后续更新不需要执行渲染函数重新生成 vnode。因此，这时就会使用创建克隆节点的方法将 vnode 克隆一份，使用克隆节点进行渲染。这样就不需要重新执行渲染函数生成新的静态节点的 vnode，从而提升一定程度的性能。")]),t._v(" "),s("h4",{attrs:{id:"类型-4-元素节点"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#类型-4-元素节点"}},[t._v("#")]),t._v(" 类型 4：元素节点")]),t._v(" "),s("p",[t._v("元素节点通常会存在以下四种有效属性：")]),t._v(" "),s("ul",[s("li",[t._v("tag：节点的名称，例如 "),s("code",[t._v("p、ul、li、div")]),t._v("等")]),t._v(" "),s("li",[t._v("data：节点上的数据，比如 "),s("code",[t._v("attrs、class、style")]),t._v("等")]),t._v(" "),s("li",[t._v("children：当前节点的子节点列表")]),t._v(" "),s("li",[t._v("context：当前组件的 Vue.js 实例")])]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v('# 一个真实的元素节点\n<p><span>Hello</span><span>World</span></p>\n\n# 对应的 vnode 如下\n{\n  children: [VNode, VNode],\n  context: {...},\n  data: {...},\n  tag: "p",\n  ......\n}\n')])])]),s("h4",{attrs:{id:"类型-5-组件节点"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#类型-5-组件节点"}},[t._v("#")]),t._v(" 类型 5：组件节点")]),t._v(" "),s("p",[t._v("组件节点和元素节点类似，不过有以下两个独有的属性：")]),t._v(" "),s("ul",[s("li",[t._v("componentOptions：组件节点的选项参数，其中包含 "),s("code",[t._v("propsData、tag、children")]),t._v(" 等信息。")]),t._v(" "),s("li",[t._v("componentInstance：组件的实例，在 Vue.js 中，每个组件都是一个 Vue.js 实例。")])]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v('# 一个组件节点\n<child></child>\n\n# 对应的 vnode 如下\n{\n  componentInstance: {...},\n  componentOptions: {...},\n  context: {...},\n  data: {...},\n  tag: "vue-component-1-child",\n  ......\n}\n')])])]),s("h4",{attrs:{id:"类型-6-函数式组件"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#类型-6-函数式组件"}},[t._v("#")]),t._v(" 类型 6：函数式组件")]),t._v(" "),s("p",[t._v("函数式组件和组件节点类似，不过有两个独有的属性："),s("code",[t._v("functionalContext")]),t._v(" 和 "),s("code",[t._v("functionalOptions")]),t._v("。")]),t._v(" "),s("h3",{attrs:{id:"virtual-dom-执行流程"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#virtual-dom-执行流程"}},[t._v("#")]),t._v(" Virtual DOM 执行流程")]),t._v(" "),s("p",[t._v("Vue.js 中通过模板来描述状态与视图之间的映射关系，所以它会先将模板编译成渲染函数，然后执行渲染函数生成虚拟节点，最后使用虚拟节点更新视图。Virtual DOM 在 Vue.js 中所做的是提供虚拟节点 vnode 和对新旧两个 vnode 进行对比，并根据对比结果进行 DOM 操作来更新视图。")]),t._v(" "),s("h2",{attrs:{id:"virtual-dom-的作用"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#virtual-dom-的作用"}},[t._v("#")]),t._v(" Virtual DOM 的作用")]),t._v(" "),s("ul",[s("li",[t._v("维护视图和状态的关系")]),t._v(" "),s("li",[t._v("复杂视图情况下提升渲染性能（需要考虑场景）")]),t._v(" "),s("li",[t._v("除了渲染成 DOM 以外，还可以实现 SSR（Nuxt.js/Next.js）、原生应用（Weex/React Native）、小程序（mpvue/uni-app）等。")])]),t._v(" "),s("h2",{attrs:{id:"diff-算法"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#diff-算法"}},[t._v("#")]),t._v(" diff 算法")]),t._v(" "),s("p",[t._v("为了尽可能减少在页面上频繁操作大规模的真实 DOM，需要在 Virtual DOM 中进行新旧 vnode 的比较，在比较的过程中对于差异的节点调用 DOM api 进行增删改等操作从而更新真实 DOM，这个过程就是 DOM diff，diff 的具体过程和原理就是 diff 算法。")]),t._v(" "),s("p",[t._v("一般 diff 两棵树，复杂度是 O(n^3)，这样的复杂度对于前端框架来说是不可接受的，所以前端框架的 dif 约定了两种处理原则："),s("strong",[t._v("只做同层的对比，type 变了就不再对比子节点。")])]),t._v(" "),s("p",[t._v("因为 DOM 节点做跨层级移动的情况还是比较少的，一般情况下都是同一层级的 DOM 的增删改，这样只要遍历，对比一下 type 就行了，是 O(n) 的复杂度，而且 type 变了就不再对比子节点，能省下一大片节点的遍历。另外，因为 Virtual DOM 中记录了关联的 DOM 节点，执行 DOM 的增删改也不需要遍历，是 O(1) 的复杂度，整体的 dff 算法复杂度就是 O(n)。")]),t._v(" "),s("p",[s("strong",[t._v("diff 算法除了考虑本身的时间复杂度之外，还要做考虑 DOM 的操作次数，所以就要尽量复用节点，通过移动节点代替创建。")])]),t._v(" "),s("p",[t._v("Vue2 的 diff 流程图：")]),t._v(" "),s("p",[s("img",{attrs:{src:e(398),alt:""}})]),t._v(" "),s("h3",{attrs:{id:"简单-diff-算法"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#简单-diff-算法"}},[t._v("#")]),t._v(" 简单 diff 算法")]),t._v(" "),s("p",[t._v("为了尽可能的复用节点，通常会根据 key 或者其他唯一标识符来进行检索，找到已经存在的节点，然后通过移动节点代替创建。")]),t._v(" "),s("p",[t._v("所以简单的 diff 算法就是遍历 newVnode 数组的每个节点，再遍历 oldVnode 数组，看中有没有对应的 key，有的话就移动到新的位置，没有的话再创建新的。目的是根据 key 复用 DOM 节点，通过移动节点而不是创建新节点来减少 DOM 操作。")]),t._v(" "),s("h3",{attrs:{id:"双端-diff-算法"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#双端-diff-算法"}},[t._v("#")]),t._v(" 双端 diff 算法")]),t._v(" "),s("p",[t._v("简单 diff 算法需要遍历 newVnode 数组 和 oldVnode 数组，双端 diff 有 4 个指针，分别指向新旧两个 vnode 数组的头尾。头和尾的指针向中间移动，直到 "),s("code",[t._v("oldStartIdx > oldEndIdx")]),t._v(" 或者 "),s("code",[t._v("newStartIdx > newEndIdx")]),t._v("，说明处理完了所有符合的节点，剩余的节点可以直接添加或者删除。")]),t._v(" "),s("p",[t._v("每次对比 "),s("code",[t._v("sameVnode(oldStartVnode, newStartVnode)")]),t._v("、"),s("code",[t._v("sameVnode(oldEndVnode, newEndVnode)")]),t._v("、"),s("code",[t._v("sameVnode(oldStartVnode, newEndVnode)")]),t._v("、"),s("code",[t._v("sameVnode(oldEndVnode, newStartVnode)")]),t._v("，即两个头、两个尾，旧的头和新的尾，旧的尾和新的头。")]),t._v(" "),s("h4",{attrs:{id:"如果符合上面的某个判断-那么节点就是可以复用的"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#如果符合上面的某个判断-那么节点就是可以复用的"}},[t._v("#")]),t._v(" 如果符合上面的某个判断，那么节点就是可以复用的")]),t._v(" "),s("ul",[s("li",[t._v("对于两个头和两个尾可以复用的节点就直接用 pathVnode 更新一下")]),t._v(" "),s("li",[t._v("旧的头和新的尾复用节点的时候，除了 pathVnode 更新外，还需要把旧的 DOM 移动到最后")]),t._v(" "),s("li",[t._v("旧的尾和新的头复用节点的时候，除了 pathVnode 更新外，还需要把旧的 DOM 移动到最前面")])]),t._v(" "),s("p",[t._v("以上的操作完成后，4 个指针都是需要移动的")]),t._v(" "),s("h4",{attrs:{id:"如果双端都没有可复用的节点"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#如果双端都没有可复用的节点"}},[t._v("#")]),t._v(" 如果双端都没有可复用的节点")]),t._v(" "),s("p",[t._v("需要在 oldVnode 数组中按照 key 来寻找")]),t._v(" "),s("ul",[s("li",[t._v("如果找到了，就把它放到 oldStartVnode.elm（真实 DOM 节点） 的前面，当前的 oldVnode 节点设置为 undefined")]),t._v(" "),s("li",[t._v("如果没找到（可能是根据 key 没找到，或者干脆没有 key），就新建一个节点，然后插入到 oldStartVnode.elm 之前")])]),t._v(" "),s("p",[t._v("以上的操作完成后，newStartIdx 指针会移动")]),t._v(" "),s("h4",{attrs:{id:"符合条件的都处理完之后"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#符合条件的都处理完之后"}},[t._v("#")]),t._v(" 符合条件的都处理完之后")]),t._v(" "),s("ul",[s("li",[t._v("如果 newVnode 数组有剩余，就会批量新增")]),t._v(" "),s("li",[t._v("如果 oldVnode 数组有剩余，就会批量递减")])]),t._v(" "),s("h3",{attrs:{id:"vue3-最长递增子序列"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#vue3-最长递增子序列"}},[t._v("#")]),t._v(" Vue3 最长递增子序列")]),t._v(" "),s("p",[t._v("详见"),s("a",{attrs:{href:"https://juejin.cn/post/6919376064833667080#heading-14",target:"_blank",rel:"noopener noreferrer"}},[t._v("Vue3 Diff —— 最长递增子序列"),s("OutboundLink")],1)]),t._v(" "),s("h2",{attrs:{id:"推荐阅读"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#推荐阅读"}},[t._v("#")]),t._v(" 推荐阅读")]),t._v(" "),s("ul",[s("li",[s("a",{attrs:{href:"https://mp.weixin.qq.com/s/HwowUwWA4pkSIQ1J4fwr9w",target:"_blank",rel:"noopener noreferrer"}},[t._v("diff 算法深入一下？"),s("OutboundLink")],1)]),t._v(" "),s("li",[s("a",{attrs:{href:"https://juejin.cn/post/7114177684434845727",target:"_blank",rel:"noopener noreferrer"}},[t._v("聊聊 Vue 的双端 diff 算法"),s("OutboundLink")],1)]),t._v(" "),s("li",[s("a",{attrs:{href:"https://mp.weixin.qq.com/s/DsBHNWn6waaS13xX9AxJVA",target:"_blank",rel:"noopener noreferrer"}},[t._v("Vue 虚拟 DOM 和 Diff 算法源码解析"),s("OutboundLink")],1)]),t._v(" "),s("li",[s("a",{attrs:{href:"https://mp.weixin.qq.com/s?__biz=Mzg3MDY2NTEyNg==&mid=2247487073&idx=1&sn=790580c3905876d3f380d6229693cfc4&scene=21#wechat_redirect",target:"_blank",rel:"noopener noreferrer"}},[t._v("图解 Diff 算法——Vue 篇"),s("OutboundLink")],1)]),t._v(" "),s("li",[s("a",{attrs:{href:"https://juejin.cn/post/6919376064833667080",target:"_blank",rel:"noopener noreferrer"}},[t._v("React、Vue2、Vue3 的三种 Diff 算法"),s("OutboundLink")],1)])])])}),[],!1,null,null,null);a.default=n.exports}}]);