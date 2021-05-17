# Vue.js 源码—Vue 构造函数和初始化

> Vue.js 版本为 v2.5.20

## Vue 构造函数

### 平台相关的入口文件

在上一节 [Vue.js 源码-项目基础和项目构建](./directory-build.html) 提到 Vue.js 构建过程，在 web 应用下，我们构建完整版的 CommonJS 版本的代码，构建后的 `dist/vue.common.js` 的打包入口路径是 `src/platforms/web/entry-runtime-with-compiler.js`。在这个入口文件中我们可以看到：

```js
/** src/platforms/web/entry-runtime-with-compiler.js */
// ……省略代码

import Vue from './runtime/index'

// ……省略代码

export default Vue
```

我们的业务代码执行到 `import Vue from 'vue'` 的时候，就是从这个入口导入的 Vue。

通过上面的代码我们可以看到 `import Vue from './runtime/index'`，入口 JS 的 Vue 又是从 `src/platforms/web/runtime/index.js` 导入的。`src/platforms/web/runtime/index.js` 代码如下：

```js
/** src/platforms/web/runtime/index.js */
import Vue from 'core/index'

// ……省略代码

export default Vue
```

### 从入口模块到核心模块

通过 `import Vue from 'core/index'` 可以知道，真正初始化 Vue 的地方是在 `src/core/index.js` 中：

```js
/** src/core/index.js */
import Vue from './instance/index'

// ……省略代码

export default Vue
```

从代码中我们可以看到 `import Vue from './instance/index'`，从 `./instance/index` 导出 Vue，代码在 `src/core/instance/index.js` 中：

```js
/** src/core/instance/index.js */
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue(options) {
  if (process.env.NODE_ENV !== 'production' && !(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
```

终于在这里我们看到了 Vue 构造函数，我们工作中 `new Vue()` 实例化的就是它。

## Vue 初始化

我们找到了 Vue 构造函数，之后我们就可以从 Vue 构造函数声明的地方开始，看一下 Vue 的初始化过程。根据我们之前寻找 Vue 构造函数的路线，然后从这条路线往回走： `src/core/instance/index.js` -> `src/core/index.js` -> `src/platforms/web/runtime/index.js` -> `src/platforms/web/entry-runtime-with-compiler.js`

### src/core/instance/index.js

先回头看上面贴出完整代码的 `src/core/instance/index.js` 文件，引入了五个函数，每个函数都以 Mixin 为后缀，然后定义 Vue 构造函数，随后以 Vue 构造函数作为参数，调用了五个引入的函数，最后导出 Vue。这五个函数分别来自 `src/core/instance` 文件夹下的五个文件：`init.js`、`state.js`、`events.js`、`lifecycle.js`、`render.js`。在这五个文件中找到相应的函数，就会发现，这些函数的作用，就是在 Vue 的 prototype 上挂载方法或属性。

```js
/** src/core/instance/init.js  initMixin(Vue)*/
Vue.prototype._init = function() {}

/** src/core/instance/state.js  stateMixin(Vue)*/
Vue.prototype.$data
Vue.prototype.$props
Vue.prototype.$set = set
Vue.prototype.$delete = del
Vue.prototype.$watch = function() {}

/** src/core/instance/events.js  eventsMixin(Vue)*/
Vue.prototype.$on = function() {}
Vue.prototype.$once = function() {}
Vue.prototype.$off = function() {}
Vue.prototype.$emit = function() {}

/** src/core/instance/lifecycle.js  lifecycleMixin(Vue)*/
Vue.prototype._update = function() {}
Vue.prototype.$forceUpdate = function() {}
Vue.prototype.$destroy = function() {}

/** src/core/instance/render.js  renderMixin(Vue)*/
Vue.prototype.$nextTick = function() {}
Vue.prototype._render = function() {}
// renderMixin函数中又调用了 installRenderHelpers 函数， 传参是 Vue.prototype
Vue.prototype._o = markOnce
Vue.prototype._n = toNumber
Vue.prototype._s = toString
Vue.prototype._l = renderList
Vue.prototype._t = renderSlot
Vue.prototype._q = looseEqual
Vue.prototype._i = looseIndexOf
Vue.prototype._m = renderStatic
Vue.prototype._f = resolveFilter
Vue.prototype._k = checkKeyCodes
Vue.prototype._b = bindObjectProps
Vue.prototype._v = createTextVNode
Vue.prototype._e = createEmptyVNode
Vue.prototype._u = resolveScopedSlots
Vue.prototype._g = bindObjectListeners
```

### src/core/index.js

看完了 `src/core/instance/index.js` 文件后，我们再往上找到引入 `src/core/instance/index.js` 的 `src/core/index.js` 文件。

```js
/** src/core/index.js */
import Vue from './instance/index'
import { initGlobalAPI } from './global-api/index'
import { isServerRendering } from 'core/util/env'
import { FunctionalRenderContext } from 'core/vdom/create-functional-component'

initGlobalAPI(Vue)

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering,
})

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get() {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  },
})

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext,
})

Vue.version = '__VERSION__'

export default Vue
```

从 `src/core/instance/index` 中导入已经在原型上挂载了方法和属性后的 Vue，之后将 Vue 作为参数传递给 `initGlobalAPI` 函数，然后在 `Vue.prototype` 上挂载了 `$isServer` 和 `$ssrContext` ，最后在 Vue 上挂载了 `FunctionalRenderContext` 和 `version`。

`initGlobalAPI` 的作用是在 Vue 构造函数上挂载静态属性和方法，Vue 经过 initGlobal 之后，再加上 `src/core/index.js` 自己挂载的，Vue 会扩展为下面的样子：

```js
/** src/core/global-api/index.js */
Vue.config
Vue.util = {
  warn,
  extend,
  mergeOptions,
  defineReactive,
}
Vue.set = set
Vue.delete = del
Vue.nextTick = nextTick
Vue.options = {
  _base: Vue,
  components: {
    KeepAlive,
  },
}
// use.js
Vue.use = function() {}
// mixin.js
Vue.mixin = function() {}
// extend.js
Vue.cid = 0
Vue.extend = function() {}
// assets.js
Vue.component = function() {}
Vue.directive = function() {}
Vue.filter = function() {}

/** src/core/index.js */
Vue.prototype.$isServer
Vue.prototype.$ssrContext
Vue.FunctionalRenderContext
Vue.version = '__VERSION__'
```

其中，`Vue.options` 稍微复杂一点，后面还会进行进一步分析的。此外 `Vue.util` 暴露的方法最好不要依赖，因为它可能经常会发生变化，是不稳定的。

### src/platforms/web/runtime/index.js

再往上就会走到 `src/platforms/web/runtime/index.js`, 这个文件里的代码主要做了三件事：

1. 覆盖 `Vue.config` 的属性，将其设置为平台特有的一些方法
2. `Vue.options.directives` 和 `Vue.options.components` 安装平台特有的指令和组件
3. 在 Vue.prototype 上定义 `__patch__` 和 `$mount`

经过 `src/platforms/web/runtime/index.js` 文件后， Vue 变成了下面这个样子：

```js
/** src/platforms/web/runtime/index.js */

// 安装平台特有的 uitls
Vue.config.mustUseProp = mustUseProp
Vue.config.isReservedTag = isReservedTag
Vue.config.isReservedAttr = isReservedAttr
Vue.config.getTagNamespace = getTagNamespace
Vue.config.isUnknownElement = isUnknownElement

// 安装平台特定的 directives 和 components
Vue.options = {
  components: {
    KeepAlive,
    Transition,
    TransitionGroup,
  },
  directives: {
    model,
    show,
  },
  filters: {},
  _base: Vue,
}
// 挂载平台的 patch 方法
Vue.prototype.__patch__ = inBrowser ? patch : noop
// 公共 mount 方法
Vue.prototype.$mount = function(
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
```

此时 `Vue.options` 又增加了一些平台相关的内容，`$mount`方法也比较简单，首先如果 el 有值并且是浏览器环境就使用 `query(el)` 获取元素，然后将 el 作为参数传递给 `mountComponent` 函数。

### src/platforms/web/entry-runtime-with-compiler.js

最后来到了最外层的 `src/platforms/web/entry-runtime-with-compiler.js` ，该文件做了两件事：

1. 缓存来自 `src/platforms/web/runtime/index.js` 的 `$mount` 方法，然后覆盖 `Vue.prototype.$mount`
2. 在 Vue 上挂载 compile

```js
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function() {}
Vue.compile = compileToFunctions
```

compileToFunctions 函数的作用就是将模板 template 编译成 render 函数。

### 总结

上面是我们初始化 Vue 构造函数的整个过程：

1. `Vue.prototype` 下的属性和方法的挂载主要是 `src/core/instance` 目录下的代码处理的
2. `Vue` 下的静态属性和方法的挂载主要是 `src/core/global-api` 目录下的代码处理的
3. `src/platforms/web/runtime/index.js` 主要是添加 web 平台特有的配置、组件和指令，还有在`Vue.prototype` 上挂载 `$mount` ，`src/platforms/web/entry-runtime-with-compiler.js` 主要是重写了 `Vue.prototype.$mount` 方法，添加了 compiler 编译器，支持 template 选项。

具体每一个挂载到 `Vue` 上的全局 API 和 `Vue.prototype` 上的实例方法的实现原理，在最后会单独拿出一节来介绍。

### 扩展

#### 为什么 Vue 不用 ES6 的 Class 实现呢？

我们在 `src/core/instance/index.js` 文件中可以看到 Vue 构造函数后面有很多 `xxxMixin` 的函数调用，并把 Vue 当做参数传入，它们的功能都是给 Vue 的 prototype 上扩展一些方法，Vue 按功能把这些扩展分散到多个模块中实现，而不是在一个模块里实现所有的扩展，这种方式是用 Class 难以实现的。这么做的好处是非常方便代码的维护和管理。

## 参考文档

- [Vue2.1.7 源码学习](http://hcysun.me/2017/03/03/Vue%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/#%E4%B8%89%E3%80%81Vue-%E7%9A%84%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0%E6%98%AF%E4%BB%80%E4%B9%88%E6%A0%B7%E7%9A%84)
- [Vue.js 源码从入口开始](https://ustbhuangyi.github.io/vue-analysis/v2/prepare/entrance.html#vue-%E7%9A%84%E5%85%A5%E5%8F%A3)
