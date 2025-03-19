(window.webpackJsonp=window.webpackJsonp||[]).push([[156],{596:function(t,e,i){"use strict";i.r(e);var a=i(25),v=Object(a.a)({},(function(){var t=this,e=t._self._c;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h1",{attrs:{id:"vue-3-概览"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#vue-3-概览"}},[t._v("#")]),t._v(" Vue 3 概览")]),t._v(" "),e("h2",{attrs:{id:"vue2-和-vue3-对比"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#vue2-和-vue3-对比"}},[t._v("#")]),t._v(" Vue2 和 Vue3 对比")]),t._v(" "),e("p",[t._v("虽然 Vue2 几乎能满足日常开发的所有需求，但是在作者看来还是有很多需要解决的痛点：源码自身的可维护性、数据量大后代码的渲染和更新的性能问题，一些想舍弃但是为了兼容一直保留的鸡肋 API 等。另外作者还希望能给开发人员带来更好的开发体验，例如：更好的 TypeScript 支持，更好的逻辑复用实践")]),t._v(" "),e("h3",{attrs:{id:"vue2-的-options-api-和-vue3-的-composition-api"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#vue2-的-options-api-和-vue3-的-composition-api"}},[t._v("#")]),t._v(" Vue2 的 Options API 和 Vue3 的 Composition API")]),t._v(" "),e("h4",{attrs:{id:"options-api"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#options-api"}},[t._v("#")]),t._v(" Options API")]),t._v(" "),e("ul",[e("li",[t._v("选项式的 api，相关代码必须写在规定的选项中，导致相同功能的代码被分割，代码量上来后查找相关代码很麻烦，后期维护修改难度较大")]),t._v(" "),e("li",[t._v("数据都挂载在同一个 this 下，对 TypeScript 的支持不友好，类型推断很麻烦")]),t._v(" "),e("li",[t._v("逻辑代码的复用能力很差")])]),t._v(" "),e("h4",{attrs:{id:"composition-api"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#composition-api"}},[t._v("#")]),t._v(" Composition API")]),t._v(" "),e("ul",[e("li",[t._v("更灵活的代码组织：组合式 api，代码定义很自由，相同功能代码整合到一起，查找修改都很方便")]),t._v(" "),e("li",[t._v("更好的逻辑复用：公共代码的复用很简单，不同功能的代码也可以自由组合")]),t._v(" "),e("li",[t._v("更小的生产包体积：Vue 相关的 api 都是通过 import 导入的，打包的时候很友好")]),t._v(" "),e("li",[t._v("更好的类型推导")])]),t._v(" "),e("p",[t._v("从 Options API 到 Composition API ，不仅仅是语法的改变，也是关注点的转变。Options API 指的是选项，是组件的选项，关注的重点在组件上面。而 Vue3 的 Composition API 是功能的组合，或者说是数据的组合，关注的重点在数据上面，从 Options 到 Composition 就是从组件到数据的转变。")]),t._v(" "),e("p",[t._v("Vue 的作者可能更希望的是研发人员将主要的关注放在数据逻辑的处理上面，围绕通过数据来驱动的核心，而不能因为组件限制了数据的流通。")]),t._v(" "),e("h2",{attrs:{id:"vue-3-一些变更"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#vue-3-一些变更"}},[t._v("#")]),t._v(" Vue 3 一些变更")]),t._v(" "),e("ul",[e("li",[t._v("全局的操作不再使用 Vue 实例，而是使用通过 createApp 创建的 app 实例")]),t._v(" "),e("li",[t._v("全局和内部的 API 已经被重构，需要使用 import 导入，并且支持 tree-shaking")])]),t._v(" "),e("h2",{attrs:{id:"vue2-要不要升级到-vue3"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#vue2-要不要升级到-vue3"}},[t._v("#")]),t._v(" Vue2 要不要升级到 Vue3")]),t._v(" "),e("p",[t._v("Vue3 确实是好的，项目应不应该升级却不一定，升不升级还是要根据项目的实际情况来决定。")]),t._v(" "),e("p",[t._v("从 2.x 升级到 3.0 不仅项目代码要修改，所依赖的周边生态也需要升级。这其实是一个相当大的工作量，也需要承担一定的风险，所以如果你的项目非常庞大且已经相对稳定，没有什么特别的痛点，那些升级要慎重。")]),t._v(" "),e("ul",[e("li",[t._v("新项目不需要兼容 IE11 —— 可以直接使用 Vue3")]),t._v(" "),e("li",[t._v("需要兼容 IE11 —— 不能升级，需要 Vue2.x 的版本，如果想体验 Composition API，可以使用 Vue2.7 版本")]),t._v(" "),e("li",[t._v("重度依赖某个第三方组件 —— 需要视第三方组件是否支持 Vue3 来决定是否升级")]),t._v(" "),e("li",[t._v("项目需要长期支持（2 年起步），且高频维护 —— 可以考虑升级 Vue3")])]),t._v(" "),e("p",[t._v("如果要升级可以考虑使用 @vue/compat 或者 GOGOCode 辅助。")]),t._v(" "),e("h2",{attrs:{id:"vue-3-diff-算法"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#vue-3-diff-算法"}},[t._v("#")]),t._v(" Vue 3 diff 算法")]),t._v(" "),e("p",[t._v("更 Vue2 的双端 diff 算法不同，Vue3 采用的是最长递增子序列来作为 diff 的主要方式")]),t._v(" "),e("ul",[e("li",[e("a",{attrs:{href:"https://juejin.cn/post/6919376064833667080#heading-14",target:"_blank",rel:"noopener noreferrer"}},[t._v("Vue3 Diff —— 最长递增子序列"),e("OutboundLink")],1)]),t._v(" "),e("li",[e("a",{attrs:{href:"https://mp.weixin.qq.com/s?__biz=Mzg3MDY2NTEyNg==&mid=2247487073&idx=1&sn=790580c3905876d3f380d6229693cfc4&scene=21#wechat_redirect",target:"_blank",rel:"noopener noreferrer"}},[t._v("vue3--最长递增子序列（部分）"),e("OutboundLink")],1)])])])}),[],!1,null,null,null);e.default=v.exports}}]);