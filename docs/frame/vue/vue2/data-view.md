# Vue.js 源码—数据驱动视图（模板和数据如何渲染成最终 DOM）

> Vue.js 版本为 v2.6.14

Vue.js 的核心思想之一是数据驱动视图。所谓数据驱动视图，是指视图是由数据驱动生成的，我们要对视图进行修改，不是直接操作 DOM，而是通过修改数据触发视图变更。

数据驱动视图优点：

- 相比于传统的前端开发时的直接修改 DOM，数据驱动视图大大简化了代码量。
- 当交互复杂的时候，只关心数据的修改会让代码的逻辑变得非常清晰，并且非常利于维护。因为 DOM 变成了数据的映射，我们所有的逻辑都是对数据的修改，而不用操作 DOM。

我们从一个很简单的例子出发，从源码角度来分析 Vue 是如何实现通过简洁的模板语法，声明式的将数据渲染为 DOM 的。分析过程会以主线代码为主，重要的分支逻辑放在之后单独分析。

> 强调一点：看大多数源码的时候，技巧是**注重大体框架，从宏观到微观**，当看一个项目代码的时候，最好是能找到一条主线，先把大体流程结构摸清楚，再深入到细节，逐项击破。

示例代码：

```html
<div id="app">
  {{ message }}
</div>
```

```js
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
  },
})
```

## new Vue 背后发生的事情

从入口代码开始分析，我们先来分析 `new Vue` 到底做了些什么。

我们到定义 Vue 构造函数的文件中看一下源码： `src/core/instance/index.js`

```js
function Vue(options) {
  if (process.env.NODE_ENV !== 'production' && !(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
```

源码首先有一个安全模式的处理，通过 `warn` 可以知道 `Vue` 只能通过 new 关键字实例化，然后会调用 `this._init` 方法，将我们的参数 `options` 透传过去，该方法在 `src/core/instance/init.js` 中定义。

```js
let uid = 0

Vue.prototype._init = function(options?: Object) {
  const vm: Component = this
  // a uid
  vm._uid = uid++

  let startTag, endTag
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    startTag = `vue-perf-start:${vm._uid}`
    endTag = `vue-perf-end:${vm._uid}`
    mark(startTag)
  }

  // a flag to avoid this being observed
  vm._isVue = true
  // merge options
  if (options && options._isComponent) {
    // optimize internal component instantiation
    // since dynamic options merging is pretty slow, and none of the
    // internal component options needs special treatment.
    // 就是动态合并options很慢，而内部组件不需要特殊处理，所以进行了此处优化
    initInternalComponent(vm, options)
  } else {
    vm.$options = mergeOptions(
      resolveConstructorOptions(vm.constructor),
      options || {},
      vm
    )
  }
  /* istanbul ignore else */
  if (process.env.NODE_ENV !== 'production') {
    initProxy(vm)
  } else {
    vm._renderProxy = vm
  }
  // expose real self
  vm._self = vm
  initLifecycle(vm)
  initEvents(vm)
  initRender(vm)
  callHook(vm, 'beforeCreate')
  initInjections(vm) // resolve injections before data/props
  initState(vm)
  initProvide(vm) // resolve provide after data/props
  callHook(vm, 'created')

  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    vm._name = formatComponentName(vm, false)
    mark(endTag)
    measure(`vue ${vm._name} init`, startTag, endTag)
  }

  if (vm.$options.el) {
    vm.$mount(vm.$options.el)
  }
}
```

我们可以从上到下详细过一遍：`_init()` 方法一开始的时候，将 `this` 赋值给 `vm`，然后在 `vm` (即 `this`) 上定义了两个属性：`_uid` 和 `_isVue`，然后判断有没有定义 `options._isComponent`，在使用 Vue 开发项目的时候，我们是不会使用 `_isComponent` 选项的，这个选项是 Vue 内部使用的，这里会走 else 分支：

```js
vm.$options = mergeOptions(
  resolveConstructorOptions(vm.constructor),
  options || {},
  vm
)
```

这里就是 `Vue` 真正第一步做的事情： **使用策略对象合并参数选项**

### 使用策略对象合并参数选项

Vue 使用 `mergeOptions` 来处理我们实例化 Vue 时传入的参数选项（opitons），然后将返回值赋值给 `this.$options`（vm 就是 this，vm === this），传给 `mergeOptions` 函数的参数有三个。首先是：`resolveConstructorOptions(vm.constructor)`

#### resolveConstructorOptions(vm.constructor)

```js
export function resolveConstructorOptions(Ctor: Class<Component>) {
  let options = Ctor.options
  if (Ctor.super) {
    const superOptions = resolveConstructorOptions(Ctor.super)
    const cachedSuperOptions = Ctor.superOptions
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions
      // check if there are any late-modified/attached options (#4976)
      const modifiedOptions = resolveModifiedOptions(Ctor)
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions)
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
      if (options.name) {
        options.components[options.name] = Ctor
      }
    }
  }
  return options
}
```

这个函数接收一个参数 `Ctor`，通过传入的 `vm.constructor` 我们可以知道，传入的其实就是 `Vue` 构造函数本身。

```js
let options = Ctor.options
// 相当于
let options = Vue.options
```

在上一节介绍 Vue 构造函数初始化的时候，我们整理了 `Vue.options` 应该是如下结构：

```
Vue.options = {
  components: {
    KeepAlive,
    Transition,
    TransitionGroup
  },
  directives: {
    model,
    show
  },
  filters: {},
  _base: Vue
}
```

之后判断是否定义了 `Vue.super`，这个是用来处理继承的，我们后续再讲，最后 `resolveConstructorOptions` 函数直接返回了 Vue.options。也就是说，传递给 `mergeOptions`方法的第一个参数就是 `Vue.options`。

传给 `mergeOptions` 函数的第二个参数是我们实例化 Vue 构造函数时的参数选项，第三个参数是 vm，也就是 this 对象。按照我们最上面实例化 Vue 构造函数的例子，最终 `mergeOptions` 会变成下面这个样子。

```js
vm.$options = mergeOptions(
  /** Vue.options */
  {
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
  },
  /** 我们自己调用 Vue 构造函数时传入的参数选项 options */
  {
    el: '#app',
    data: {
      message: 'Hello Vue!',
    },
  },
  /** this */
  vm
)
```

整理完传参，我们就可以看看 mergeOptions 到底做了些什么，mergeOptions 函数是在 `src/core/util/options.js` 文件中定义的。这个文件内容比较多，可以整理一下关键的代码：

```js
/** 通过 src/shared/constants 引入常量 */
import { ASSET_TYPES, LIFECYCLE_HOOKS } from 'shared/constants'

/**
 * Vue源码注释：选项覆盖策略指的是一些函数，这些函数用于处理如何将父选项值和子选项值合并成最终值
 */
/** 1、合并父子选项值为最终值的策略对象，此时 strats 是一个空对象，
因为 config.optionMergeStrategies = Object.create(null) */
const strats = config.optionMergeStrategies

/** 2、在 strats 对象上定义与参数选项名称相同的方法 */
// 非生产环境会使用这个逻辑
if (process.env.NODE_ENV !== 'production') {
  strats.el = strats.propsData = function(parent, child, vm, key) {
    if (!vm) {
      warn(
        `option "${key}" can only be used during instance ` +
          'creation with the `new` keyword.'
      )
    }
    return defaultStrat(parent, child)
  }
}
strats.data = function(parentVal, childVal, vm) {}
// LIFECYCLE_HOOKS 就是 ['beforeCreate','created','beforeMount','mounted','beforeUpdate','updated','beforeDestroy','destroyed','activated','deactivated','errorCaptured']
LIFECYCLE_HOOKS.forEach((hook) => {
  strats[hook] = mergeHook
})
// ASSET_TYPES 就是['component','directive','filter']
ASSET_TYPES.forEach(function(type) {
  strats[type + 's'] = mergeAssets
})
strats.watch = function(parentVal, childVal, vm, key) {}
strats.props = strats.methods = strats.inject = strats.computed = function(
  parentVal,
  childVal,
  vm,
  key
) {}
strats.provide = mergeDataOrFn

/** 3、默认的合并策略：如果有 childVal 则返回 childVal 没有则返回 parentVal */
const defaultStrat = function(parentVal: any, childVal: any): any {
  return childVal === undefined ? parentVal : childVal
}

/**
 * Vue源码注释：把两个选项对象合并成一个新的，实例化和继承中都会用到。
 */
/** 4、mergeOptions 中根据参数选项调用同名的策略方法进行合并处理 */
export function mergeOptions(
  parent: Object,
  child: Object,
  vm?: Component
): Object {
  // …… 其他代码

  const options = {}
  for (key in parent) {
    mergeField(key)
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key)
    }
  }
  function mergeField(key) {
    const strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key], vm, key)
  }
  return options
}
```

接下来看一下我们的示例代码传入的 options 是怎么合并的：

```js
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
  },
})
```

其中 `el` 选项会使用 `defaultStrat` 默认策略函数处理， data 选项则会使用 `strats.data` 中的逻辑处理，`strats.data` 方法最终会返回一个函数：`mergedInstanceDataFn`。

我们继续抓住主线往下走，就不详细去看每一个策略函数的内容了，这里只需要知道 Vue 在处理选项（options）的时候，使用了一个策略对象对父子选项进行合并，并将最终的值赋值给实例的 `$options` 属性即 `this.$options`。

`_init()` 方法在合并完选项后，就进入到了 Vue 实例对象的初始化。上一节讲了 Vue 构造函数的初始化，整理了 Vue 原型属性与方法和 Vue 静态属性与方法，而 Vue 实例对象就是通过实例化构造函数创造出来的。下面的代码是 `_init()` 方法合并完选项之后的代码：

```js
if (process.env.NODE_ENV !== 'production') {
  initProxy(vm)
} else {
  vm._renderProxy = vm
}
// expose real self
vm._self = vm
initLifecycle(vm)
initEvents(vm)
initRender(vm)
callHook(vm, 'beforeCreate')
initInjections(vm) // resolve injections before data/props
initState(vm)
initProvide(vm) // resolve provide after data/props
callHook(vm, 'created')
```

根据上面的代码，在生产环境下会为实例添加两个属性，并且属性值都为实例本身：

```js
vm._renderProxy = vm
vm._self = vm
```

随后调用了 `initLifecycle`、`initEvents`、`initRender` ，完成了这三个 init 后，触发 `beforeCreate` 生命周期钩子，然后调用 `initInjections`、`initState`、`initProvide`，最后触发 `created` 生命周期钩子。

上面 `init*`都是在处理 Vue 实例对象以及做一些初始化的工作，Vue 实例对象初始化走到现在，可以整理出 Vue 实例对象属性和方法如下：

```js
/** 调用 this._init(options) ，即在 src/core/instance/init.js 中的 Vue.prototype._init 添加的属性 */
this._uid = uid++
this._isVue = true
this.$options = {
  components,
  directives,
  filters,
  _base: Vue,
  el: '#app',
  data: mergedInstanceDataFn,
}
this._renderProxy = this
this._self = this

/** 调用 src/core/instance/lifecycle.js 中的 initLifecycle 添加的属性 */
this.$parent = parent
this.$root = parent ? parent.$root : this

this.$children = []
this.$refs = {}

this._watcher = null
this._inactive = null
this._directInactive = false
this._isMounted = false
this._isDestroyed = false
this._isBeingDestroyed = false

/** 调用 src/core/instance/events.js 中的 initEvents 添加的属性 */
this._events = Object.create(null)
this._hasHookEvent = false

/** 调用 src/core/instance/render.js 中的 initRender 添加的属性 */
this._vnode = null // the root of the child tree
this._staticTrees = null // v-once cached trees
this.$vnode = this.$options._parentVnode
this.$slots = resolveSlots(
  this.$options._renderChildren,
  this.$options._parentVnode || this.$options._parentVnode.context
)
this.$scopedSlots = emptyObject
this._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
this.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)

/** 调用 src/core/instance/inject.js 中的 initInjections 和 initProvide 添加的属性 */
const provide = this.$options.provide
if (provide) {
  this._provided = typeof provide === 'function' ? provide.call(this) : provide
}

/** 调用 src/core/instance/state.js 中的 initState 添加的属性 */
this._watcher = []
const opts = this.$options
if (opts.props) initProps(vm, opts.props) // this._props = {}
if (opts.methods) initMethods(vm, opts.methods)
if (opts.data) {
  initData(vm) // this._data
} else {
  observe((vm._data = {}), true /* asRootData */)
}
if (opts.computed) initComputed(vm, opts.computed) // this._computedWatchers
if (opts.watch && opts.watch !== nativeWatch) {
  initWatch(vm, opts.watch)
}
```

以上就是一个 Vue 实例对象所包含的属性和方法，除此之外要注意的是：在 `initEvents` 中除了添加属性之外，如果有 `vm.$options._parentListeners` 还要调用 `vm._updateListeners` 方法，而在 `initState` 中又调用了一些其他 init 方法。

`_init`执行到最后，如果有 `vm.$options.el` 还要调用 `vm.$mount(vm.$options.el)`，如下：

```js
// 这也就是为什么如果不传递 el 选项就需要手动 mount 的原因了。
if (vm.$options.el) {
  vm.$mount(vm.$options.el)
}
```

回到最开始的例子，由于我们只传递了 `el` 和 `data`，所以 `initData` 会执行，最后会执行 `vm.$mount(vm.$options.el)`。

由于本章的目标是弄清楚模板和数据如何渲染成最终的 DOM，所以各种初始化的逻辑我们先不深入探究，在初始化的最后，检测到如果有 `el` 选项，则调用 `vm.$mount` 方法挂载 `vm`，挂载就是把模板渲染成最终的 DOM。那么接下来，我们分析 Vue 的挂载过程。

### 总结

Vue 实例对象初始化主要就干了几件事：使用策略对象合并参数选项、初始化生命周期、初始化事件中心，初始化渲染、调用 `beforeCreate` 生命周期钩子、初始化 injections、初始化 data、props、computed、watcher、初始化 provide、调用 `created` 生命周期钩子。

Vue 的初始化逻辑写的非常清楚，把不同的功能逻辑拆成一些单独的函数执行，让主线逻辑一目了然，这样的编程思想是非常值得借鉴和学习的。

## Vue 实例挂载的实现

Vue 中我们是通过 `$mount` 实例方法去挂载 `vm` 的，因为 `$mount` 这个方法的实现跟平台、构建方式都有关,所以 `$mount` 方法在多个文件中都有定义，如 `src/platforms/web/entry-runtime-with-compiler.js`、`src/platforms/web/runtime/index.js`、`src/platforms/weex/runtime/index.js`。我们重点分析的是带 `compiler` 版本的 `$mount` 实现，因为抛开 webpack 的 vue-loader，我们在纯前端浏览器环境分析 Vue 的工作原理，有助于我们对原理理解的深入。

### entry-runtime-with-compiler.js 中的 `$mount`

先来看一下 `src/platforms/web/entry-runtime-with-compiler.js` 中定义的 `$mount`，具体的解析直接在代码中注释：

```js
// 首先缓存了原型上的 `$mount` 方法，再重新定义该方法。
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function(
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)

  /* istanbul ignore if */
  // 对 el 做了限制，Vue 不能挂载在 body 、 html 这样的根节点上
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' &&
      warn(
        `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
      )
    return this
  }

  const options = this.$options
  // resolve template/el and convert to render function
  // 如果没有定义 render 方法，则会把 el 或者 template 字符串转换成 render 方法
  if (!options.render) {
    let template = options.template
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el)
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }

      // 无论我们是用单文件 .vue 方式开发组件，还是写了 el 或者 template 属性，最终都会转换成 render 方法，
      // 这个过程是 Vue 的一个“在线编译”的过程，它是调用 `compileToFuntions` 方式实现的
      const { render, staticRenderFns } = compileToFunctions(
        template,
        {
          shouldDecodeNewlines,
          shouldDecodeNewlinesForHref,
          delimiters: options.delimiters,
          comments: options.comments,
        },
        this
      )
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  // 最后调用缓存的原型上的 $mount 方法挂载
  return mount.call(this, el, hydrating)
}
```

分析以上代码的逻辑：

1. 缓存来自 `src/platforms/web/runtime/index.js` 文件的 `$mount` 方法。
2. 对 el 做了限制，Vue 不能挂载在 body 、 html 标签上
3. 判断有没有传递 `render` 选项，如果有，直接调用缓存起来的 `$mount`
4. 如果没有传递 `render` 选项，那么继续判断有没有传递 `template` 选项，如果有，就根据 `template` 的类型不同进行整理，例如：`template`是字符串，并且第一个字符是 `#`，就使用 `idToTemplate` 转换，如果`template` 是节点，就使用节点的 `innerHTML`。
5. 如果没有传递 `template` 选项，那么继续判断有没有传递 `el` 选项，如果有，使用 `getOuterHTML` 获取内容赋值给 `template`
6. 经过一番整理后，再判断 `template` 最终有没有值，如果 `template` 有值，就使用 `compileToFunctions` 将 `template` 编译成 `render` 函数，并把编译成的 `render` 函数挂载到 `this.$options` 属性下。
7. 最后调用缓存起来的 `$mount`。

### `runtime/index.js` 中的 `$mount`

`src/platforms/web/entry-runtime-with-compiler.js` 中是先将 `Vue.prototype.$mount` 缓存后，再重新覆写的。原先原型上的 `$mount` 方法在 `src/platforms/web/runtime/index.js` 中定义，之所以这么设计完全是为了复用，因为它可以被 `runtime only` 版本的 Vue 直接使用。

```js
// public mount method
Vue.prototype.$mount = function(
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
```

`$mount` 方法支持传入 2 个参数，第一个是 `el`，它表示挂载的元素，可以是字符串，也可以是 DOM 对象，如果 `el`有值，并且在浏览器环境下，会调用 query 方法统一转换整理成 DOM 对象。第二个参数是和服务端渲染相关，在浏览器环境下我们不需要传第二个参数。

### `mountComponent` 方法

`$mount` 方法实际上会去调用 `mountComponent` 方法，这个方法定义在 `src/core/instance/lifecycle.js` 文件中：

```js
export function mountComponent(
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  // 在 Vue 实例对象上添加 $el 属性，指向挂载元素
  vm.$el = el
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode
    if (process.env.NODE_ENV !== 'production') {
      /* istanbul ignore if */
      if (
        (vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el ||
        el
      ) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
            'compiler is not available. Either pre-compile the templates into ' +
            'render functions, or use the compiler-included build.',
          vm
        )
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        )
      }
    }
  }
  callHook(vm, 'beforeMount')

  let updateComponent
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = () => {
      const name = vm._name
      const id = vm._uid
      const startTag = `vue-perf-start:${id}`
      const endTag = `vue-perf-end:${id}`

      mark(startTag)
      const vnode = vm._render()
      mark(endTag)
      measure(`vue ${name} render`, startTag, endTag)

      mark(startTag)
      vm._update(vnode, hydrating)
      mark(endTag)
      measure(`vue ${name} patch`, startTag, endTag)
    }
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(
    vm,
    updateComponent,
    noop,
    {
      before() {
        if (vm._isMounted) {
          callHook(vm, 'beforeUpdate')
        }
      },
    },
    true /* isRenderWatcher */
  )
  hydrating = false

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  // 这里注意 vm.$vnode 表示 Vue 实例的父虚拟 Node，所以它为 `null` 则表示当前是根 Vue 实例。
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}
```

`mountComponent` 核心就是先实例化一个渲染 `Watcher`,在它的回调函数中会调用 `updateComponent` 方法，在此方法中调用 `vm._render` 方法，先生成虚拟 Node，最终调用 `vm._update` 更新 DOM。

`Watcher` 在这里起到两个作用，一个是初始化的时候会执行回调函数，另一个是当 vm 实例中监测的数据发生变化的时候执行回调函数，后续我们会详细介绍。

函数最后判断为根节点的时候设置 `vm._isMounted` 为 `true`，表示这个实例已经挂载了，同时执行 `mounted` 钩子函数。

`mountComponent` 方法的逻辑是非常清晰的，它会完成整个渲染工作。

接下来重点分析其中的两个核心方法： `vm._render` 和 `vm._update`

### render

`Vue.prototype._render` 方法是在调用 `renderMixin` 时添加的，是实例的一个私有方法，它用来把实例渲染成一个虚拟 Node。它定义在 `src/core/instance/render.js` 文件中：

```js
Vue.prototype._render = function(): VNode {
  const vm: Component = this
  const { render, _parentVnode } = vm.$options

  if (_parentVnode) {
    vm.$scopedSlots = _parentVnode.data.scopedSlots || emptyObject
  }

  // set parent vnode. this allows render functions to have access
  // to the data on the placeholder node.
  vm.$vnode = _parentVnode
  // render self
  let vnode
  try {
    vnode = render.call(vm._renderProxy, vm.$createElement)
  } catch (e) {
    handleError(e, vm, `render`)
    // return error render result,
    // or previous vnode to prevent render error causing blank component
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production' && vm.$options.renderError) {
      try {
        vnode = vm.$options.renderError.call(
          vm._renderProxy,
          vm.$createElement,
          e
        )
      } catch (e) {
        handleError(e, vm, `renderError`)
        vnode = vm._vnode
      }
    } else {
      vnode = vm._vnode
    }
  }
  // return empty vnode in case the render function errored out
  if (!(vnode instanceof VNode)) {
    if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
      warn(
        'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
        vm
      )
    }
    vnode = createEmptyVNode()
  }
  // set parent
  vnode.parent = _parentVnode
  return vnode
}
```

这段代码最关键的是 `render` 方法的调用，我们在平时的开发工作中手写 `render` 方法的场景比较少，而写的比较多的是 `template` 模板，虽然我们写的是 `template` 模板，不过在之前的 `$mount` 方法中，同样会把 `template` 编译成 `render` 方法。这个由模板到 `render` 方法的编译过程非常复杂，之后我们在分析 Vue 的编译过程的时候再看。

我们把最开始的例子自己改成 `render` 函数的写法，Vue 官方文档中介绍，`render` 函数的第一个参数是 createElement：

```js
// html
<div id="app">
  {{ message }}
</div>

// 转换为 render 函数
render: function (createElement) {
  return createElement('div', {
    attrs: {
      id: 'app'
    },
  }, this.message)
}
```

再回到 `_render` 函数中的 `render` 方法调用，可以看到， `render` 函数中的 `createElement` 就是 `vm.$createElement`

```js
vnode = render.call(vm._renderProxy, vm.$createElement)
```

实际上， `vm.$createElement` 方法定义是在执行 `initRender` 方法的时候。

```js
export function initRender(vm: Component) {
  // ……

  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)

  // ……
}
```

通过上面的代码可以看到，除了 `vm.$createElement` 方法，还有一个 `vm._c` 方法，它是给被模板编译成的 `render` 函数用的，而 `vm.$createElement` 方法，是给用户手写的 `render` 方法使用的，这两个方法支持的参数相同，并且内部都调用了 `createElement` 函数。

`vm._render` 最终是通过执行 `createElement` 方法返回的 `vnode`，它是一个虚拟 Node。Vue2.0 跟 Vue1.0 相比，最大的升级就是利用了 Virtual DOM。

#### Virtual DOM

Virtual DOM 产生的前提是浏览器中的 DOM 很“昂贵”，把一个简单的 div 元素的属性都打印出来（使用 for……in），数量肯定是超过百个的。所以一个真正的 DOM 元素是非常庞大的，这是因为浏览器标准本身就把 DOM 设计的如此复杂。当我们频繁的去做 DOM 更新，会产生一定的性能问题。

而 Virtual DOM 是用一个原生的 JavaScript 对象去描述一个 DOM 节点，属性会少的多，也不用去调用宿主的相关 API，所以它比创建一个 DOM 的代价要小很多。在 Vue.js 中，Virtual DOM 是用 `VNode` Class 描述的，它定义在 `src/core/vdom/vnode.js` 文件中：

```js
export default class VNode {
  tag: string | void
  data: VNodeData | void
  children: ?Array<VNode>
  text: string | void
  elm: Node | void
  ns: string | void
  context: Component | void // rendered in this component's scope
  key: string | number | void
  componentOptions: VNodeComponentOptions | void
  componentInstance: Component | void // component instance
  parent: VNode | void // component placeholder node

  // strictly internal
  raw: boolean // contains raw HTML? (server only)
  isStatic: boolean // hoisted static node
  isRootInsert: boolean // necessary for enter transition check
  isComment: boolean // empty comment placeholder?
  isCloned: boolean // is a cloned node?
  isOnce: boolean // is a v-once node?
  asyncFactory: Function | void // async component factory function
  asyncMeta: Object | void
  isAsyncPlaceholder: boolean
  ssrContext: Object | void
  fnContext: Component | void // real context vm for functional nodes
  fnOptions: ?ComponentOptions // for SSR caching
  devtoolsMeta: ?Object // used to store functional render context for devtools
  fnScopeId: ?string // functional scope id support

  constructor(
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.ns = undefined
    this.context = context
    this.fnContext = undefined
    this.fnOptions = undefined
    this.fnScopeId = undefined
    this.key = data && data.key
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.parent = undefined
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    this.isComment = false
    this.isCloned = false
    this.isOnce = false
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child(): Component | void {
    return this.componentInstance
  }
}
```

可以看到 Vue.js 中的 Virtual DOM 定义还是略微复杂一些的，因为它包含了很多 Vue.js 的特性，实际上 Vue.js 中的 Virtual DOM 是借鉴了开源库 [snabbdom](https://github.com/snabbdom/snabbdom) 的实现，然后加入了一些 Vue.js 特色的东西。

其实 VNode 是对真实 DOM 的一种抽象描述，它的核心定义无非就几个关键属性：标签名、数据、子节点、键值等，其它属性都是用来扩展 VNode 的灵活性以及实现一些特殊 feature 的。由于 VNode 只是用来映射真实 DOM 的，不需要包含操作 DOM 的方法，因此它是非常轻量和简单的。

Virtual DOM 除了定义它的数据结构，映射到真实的 DOM 实际上要经历 VNode 的 create、diff、patch 等过程。在 Vue.js 中，VNode 的 create 是通过之前提到的 `createElement` 方法创建的。

#### createElement

Vue.js 利用 createElement 方法创建 VNode，它定义在 `src/core/vdom/create-element.js` 文件中：

```js
// wrapper function for providing a more flexible interface
// without getting yelled at by flow
export function createElement(
  context: Component,
  tag: any,
  data: any,
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
): VNode | Array<VNode> {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children
    children = data
    data = undefined
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE
  }
  return _createElement(context, tag, data, children, normalizationType)
}
```

`createElement` 方法实际上是对 `_createElement` 方法的封装，它允许传入的参数更加灵活，在处理完这些参数后，调用真正创建 VNode 的函数 `_createElement`：

```js
export function _createElement(
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
  if (isDef(data) && isDef((data: any).__ob__)) {
    process.env.NODE_ENV !== 'production' &&
      warn(
        `Avoid using observed data object as vnode data: ${JSON.stringify(
          data
        )}\n` + 'Always create fresh vnode data objects in each render!',
        context
      )
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if (
    process.env.NODE_ENV !== 'production' &&
    isDef(data) &&
    isDef(data.key) &&
    !isPrimitive(data.key)
  ) {
    if (!__WEEX__ || !('@binding' in data.key)) {
      warn(
        'Avoid using non-primitive value as key, ' +
          'use string/number value instead.',
        context
      )
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) && typeof children[0] === 'function') {
    data = data || {}
    data.scopedSlots = { default: children[0] }
    children.length = 0
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children)
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children)
  }
  let vnode, ns
  if (typeof tag === 'string') {
    let Ctor
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag),
        data,
        children,
        undefined,
        undefined,
        context
      )
    } else if (
      (!data || !data.pre) &&
      isDef((Ctor = resolveAsset(context.$options, 'components', tag)))
    ) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag)
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(tag, data, children, undefined, undefined, context)
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children)
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) applyNS(vnode, ns)
    if (isDef(data)) registerDeepBindings(data)
    return vnode
  } else {
    return createEmptyVNode()
  }
}
```

`_createElement` 方法有 5 个参数：

- `context` 表示 VNode 的上下文环境，它是 `Component` 类型，可以在 `flow/component.js` 中找到此类型的定义。
- `tag` 表示标签，它可以是一个字符串，也可以是一个 `Component`。
- `data` 表示 VNode 的数据，它是一个 `VNodeData` 类型，可以在 `flow/vnode.js` 中找到此类型的定义。
- `children` 表示当前 VNode 的子节点，它是任意类型的，它需要被规范为标准的 VNode 数组。
- `normalizationType` 表示子节点规范的类型，类型不同，规范的方法也就不一样，它主要是区分 `render` 函数是编译生成的还是用户手写的。

`createElement` 函数的流程略微有点多，接下来主要分析两个重点流程——`children`的规范化以及 VNode 的创建。

#### children 的规范化

由于 Virtual DOM 实际上是一个树状结构，每一个 VNode 可能会有若干个子节点，这些子节点应该也是 VNode 的类型。但是 `_createElement` 接收的第 4 个参数 children 是任意类型的，因此需要把它们规范成 VNode 类型。

这里根据 `normalizationType` 的不同，分别调用了 `normalizeChildren(children)` 和 `simpleNormalizeChildren(children)` 方法，它们都定义在 `src/core/vdom/helpers/normalize-children.js`

```js
// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
export function simpleNormalizeChildren(children: any) {
  for (let i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
export function normalizeChildren(children: any): ?Array<VNode> {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
    ? normalizeArrayChildren(children)
    : undefined
}
```

`simpleNormalizeChildren` 方法被调用的场景是： `render` 函数是编译时生成的。理论上编译生成的 `children` 都是 VNode 类型的。但有一个例外，就是 `function component` 函数式组件返回的是一个数组而不是一个根节点，所以会通过 `Array.prototype.concat` 方法把整个 `children` 数组打平，让它的深度只有一层。

`normalizeChildren` 方法的调用场景有两种：一种场景是 `render` 函数是用户手写的，当 `children` 只有一个节点的时候，Vue.js 从接口层面允许用户把 `children` 写成基础类型用来创建单个简单的文本节点，这种情况会调用 `createTextVNode` 创建一个文本节点的 VNode；另一种场景是当编译 `slot`、`v-for` 的时候会产生嵌套数组的情况，会调用 `normalizeArrayChildren` 方法。

还是当前这个文件，可以看到 `normalizeArrayChildren` 方法的定义如下：

```js
function normalizeArrayChildren(
  children: any,
  nestedIndex?: string
): Array<VNode> {
  const res = []
  let i, c, lastIndex, last
  for (i = 0; i < children.length; i++) {
    c = children[i]
    if (isUndef(c) || typeof c === 'boolean') continue
    lastIndex = res.length - 1
    last = res[lastIndex]
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, `${nestedIndex || ''}_${i}`)
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]: any).text)
          c.shift()
        }
        res.push.apply(res, c)
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c)
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c))
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text)
      } else {
        // default key for nested array children (likely generated by v-for)
        if (
          isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)
        ) {
          c.key = `__vlist${nestedIndex}_${i}__`
        }
        res.push(c)
      }
    }
  }
  return res
}
```

`normalizeArrayChildren` 接收 2 个参数， `children` 表示要规范的子节点， `nestedIndex` 表示嵌套的索引，因为单个 `child` 也可能是一个数组类型。

`normalizeArrayChildren` 主要的逻辑就是遍历 `children`，获得单个节点 `c`，然后对 `c` 的类型判断：

- 如果是一个数组类型，则递归调用 `normalizeArrayChildren`；
- 如果是基础类型，则通过 `createTextVNode` 方法转换成 VNode 类型；
- 否则，就已经是 VNode 类型了， 如果 `children` 是一个列表并且列表还存在嵌套的情况，则根据 `nestedIndex` 去更新它的 key。

这里需要注意一点，在遍历的过程中，对这 3 种情况都做了如下处理：如果存在两个连续的 `text` 节点，会把它们合并成一个 `text` 节点。

经过对 `children` 的规范化，`children` 变成了一个类型为 VNode 的 Array。

#### VNode 的创建

回到 `createElement` 函数，规范化 `children` 后，接下来就会去创建一个 VNode 的实例：

```js
//……

let vnode, ns
if (typeof tag === 'string') {
  let Ctor
  ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
  if (config.isReservedTag(tag)) {
    // platform built-in elements
    vnode = new VNode(
      config.parsePlatformTagName(tag),
      data,
      children,
      undefined,
      undefined,
      context
    )
  } else if (
    (!data || !data.pre) &&
    isDef((Ctor = resolveAsset(context.$options, 'components', tag)))
  ) {
    // component
    vnode = createComponent(Ctor, data, context, children, tag)
  } else {
    // unknown or unlisted namespaced elements
    // check at runtime because it may get assigned a namespace when its
    // parent normalizes children
    vnode = new VNode(tag, data, children, undefined, undefined, context)
  }
} else {
  // direct component options / constructor
  vnode = createComponent(tag, data, context, children)
}

//……
```

这里先对 `tag` 做判断，判断过程如下：

- 如果 `tag` 是 `string` 类型
  - 则接着判断，如果是内置的一些节点（正常的 html 和 svg 的节点等），则直接创建一个普通的 VNode；
  - 如果是已注册的组件名，则通过 `createComponent` 创建一个组件类型的 VNode，否则创建一个未知标签的 VNode。
- 如果 `tag` 是 `component` 类型，则直接调用 `createComponent` 创建一个组件类型的 VNode 节点，

createComponent 创建组件类型的 VNode 的过程，后续会介绍，本质上它还是返回了一个 VNode。

至此，我们大概了解了 `createElement` 创建 VNode 的过程，每个 VNode 都有 `children`，`children` 每个元素也是 VNode，这样就形成了一个 VNode Tree，它很好的描述了我们的 DOM Tree。

### update

回到 `mountComponent` 函数中，我们已经知道 `vm._render` 是如何创建了一个 VNode，接下来就要把这个 VNode 生成一个真实的 DOM 并渲染出来，这个过程是通过 `vm._update` 完成的。

`vm._update` 是实例的一个私有方法，它被调用的时机有 2 个：一个是首次渲染，一个是数据更新的时候。本节我们值分析首次渲染部分，数据更新部分会在之后分析响应式原理的时候涉及。

`_update` 方法的作用是把 VNode 渲染成真实的 DOM，它定义在 `src/core/instance/lifecycle.js` 文件中：

```js
Vue.prototype._update = function(vnode: VNode, hydrating?: boolean) {
  const vm: Component = this
  const prevEl = vm.$el
  const prevVnode = vm._vnode
  const restoreActiveInstance = setActiveInstance(vm)
  vm._vnode = vnode
  // Vue.prototype.__patch__ is injected in entry points
  // based on the rendering backend used.
  if (!prevVnode) {
    // initial render
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
  } else {
    // updates
    vm.$el = vm.__patch__(prevVnode, vnode)
  }
  restoreActiveInstance()
  // update __vue__ reference
  if (prevEl) {
    prevEl.__vue__ = null
  }
  if (vm.$el) {
    vm.$el.__vue__ = vm
  }
  // if parent is an HOC, update its $el as well
  if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
    vm.$parent.$el = vm.$el
  }
  // updated hook is called by the scheduler to ensure that children are
  // updated in a parent's updated hook.
}
```

`_update` 的核心就是调用 `vm.__patch__` 方法，实际上这个方法在不同平台（比如 web 和 weex 上）定义是不一样的，因此在 web 平台，它是在 `src/platforms/web/runtime/index.js` 文件中定义的：

```js
// install platform patch function
Vue.prototype.__patch__ = inBrowser ? patch : noop
```

可以看到，即使在 web 平台上，是否是服务端渲染也会对这个方法产生影响。因为在服务端渲染中，没有真实的浏览器 DOM 环境， 所以不需要把 VNode 最终转换成 DOM。

因此上面的代码会判断是否是浏览器环境，如果不是浏览器环境（即服务端渲染），就给 `__patch__` 赋值 `noop` （空函数），如果是浏览器环境，就给 `__patch__` 赋值 `patch` 方法，`patch` 方法定义在 `src/platforms/web/runtime/patch.js` 文件中：

```js
import * as nodeOps from 'web/runtime/node-ops'
import { createPatchFunction } from 'core/vdom/patch'
import baseModules from 'core/vdom/modules/index'
import platformModules from 'web/runtime/modules/index'

// the directive module should be applied last, after all
// built-in modules have been applied.
const modules = platformModules.concat(baseModules)

export const patch: Function = createPatchFunction({ nodeOps, modules })
```

`patch` 实际上是 `createPatchFunction` 方法的返回值，该方法接收一个包含 `nodeOps` 和 `modules` 属性的对象作为参数。其中，`nodeOps` 封装了一系列 DOM 操作的方法，`modules` 定义了一系列模块的钩子函数的实现。

`createPatchFunction` 方法定义在 `src/core/vdom/patch.js` 文件中，简化的代码如下：

```js
const hooks = ['create', 'activate', 'update', 'remove', 'destroy']

export function createPatchFunction(backend) {
  let i, j
  const cbs = {}

  const { modules, nodeOps } = backend

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = []
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]])
      }
    }
  }

  // ……

  return function patch(oldVnode, vnode, hydrating, removeOnly) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
      return
    }

    let isInitialPatch = false
    const insertedVnodeQueue = []

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true
      createElm(vnode, insertedVnodeQueue)
    } else {
      const isRealElement = isDef(oldVnode.nodeType)
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR)
            hydrating = true
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true)
              return oldVnode
            } else if (process.env.NODE_ENV !== 'production') {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                  'server-rendered content. This is likely caused by incorrect ' +
                  'HTML markup, for example nesting block-level elements inside ' +
                  '<p>, or missing <tbody>. Bailing hydration and performing ' +
                  'full client-side render.'
              )
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode)
        }

        // replacing existing element
        const oldElm = oldVnode.elm
        const parentElm = nodeOps.parentNode(oldElm)

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm,
          nodeOps.nextSibling(oldElm)
        )

        // update parent placeholder node element, recursively
        if (isDef(vnode.parent)) {
          let ancestor = vnode.parent
          const patchable = isPatchable(vnode)
          while (ancestor) {
            for (let i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor)
            }
            ancestor.elm = vnode.elm
            if (patchable) {
              for (let i = 0; i < cbs.create.length; ++i) {
                cbs.create[i](emptyNode, ancestor)
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              const insert = ancestor.data.hook.insert
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (let i = 1; i < insert.fns.length; i++) {
                  insert.fns[i]()
                }
              }
            } else {
              registerRef(ancestor)
            }
            ancestor = ancestor.parent
          }
        }

        // destroy old node
        if (isDef(parentElm)) {
          removeVnodes(parentElm, [oldVnode], 0, 0)
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode)
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
    return vnode.elm
  }
}
```

`createPatchFunction` 内部定义了一系列的辅助方法，最终返回了一个 `patch` 方法，返回的这个方法就是 `vm._update` 函数里调用的 `vm.__patch__`。

`patch` 方法接收 4 个参数：

- `oldVnode` 表示旧的 VNode 节点，它也可以不存在或者是一个 DOM 对象
- `vnode` 表示执行 `_render` 后返回的 VNode 的节点
- `hydrating` 表示是否是服务端渲染
- `removeOnly` 是给 `transition-group` 用的，之后会介绍

`patch` 的逻辑看上去相对复杂，因为它有着非常多的分支逻辑，为了方便理解，我们并不会在这里介绍所有的逻辑，我们会针对最开始的例子来分析它的执行逻辑。先来回顾我们的例子（我们已经把 template 改为了 render 函数写法）：

```js
var app = new Vue({
  el: '#app',
  render: function(createElement) {
    return createElement(
      'div',
      {
        attrs: {
          id: 'app',
        },
      },
      this.message
    )
  },
  data: {
    message: 'Hello Vue!',
  },
})
```

然后我们在 `vm._update` 方法里会走到首次渲染的逻辑：

```js
// initial render
vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
```

结合我们的例子，我们的场景是首次渲染，所以在执行 `patch` 函数的时候：

- 传入的 `vm.$el` 对应的是例子中 id 为 `app` 的 DOM 对象（即在 index.html 模板中写的 `<div id="app"></div>`），`vm.$el` 的赋值逻辑在 `mountComponent` 函数中
- `vnode` 对应的是 `render` 函数的返回值
- `hydrating` 在非服务端渲染情况下为 false
- `removeOnly` 为 false。

确定完入参后，回到 `patch` 函数的内部看一下执行过程的几个关键步骤：

1、 判断 `oldVnode`：由于我们传入的 `oldVnode` 实际上是一个 DOM container，所以 `isRealElement` 为 true，接下来判断是否为服务端渲染，当前不是服务端渲染，直接走到最后通过 `emptyNodeAt` 函数把 `oldVnode` 转换成 `VNode` 对象。

```js
function emptyNodeAt (elm) {
  return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
}

//……

const isRealElement = isDef(oldVnode.nodeType)
if (!isRealElement && sameVnode(oldVnode, vnode)) {
  // patch existing root node
  patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
} else {
  if (isRealElement) {
    // mounting to a real element
    // check if this is server-rendered content and if we can perform
    // a successful hydration.
    if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
      oldVnode.removeAttribute(SSR_ATTR)
      hydrating = true
    }
    if (isTrue(hydrating)) {
      if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
        invokeInsertHook(vnode, insertedVnodeQueue, true)
        return oldVnode
      } else if (process.env.NODE_ENV !== 'production') {
        warn(
          'The client-side rendered virtual DOM tree is not matching ' +
            'server-rendered content. This is likely caused by incorrect ' +
            'HTML markup, for example nesting block-level elements inside ' +
            '<p>, or missing <tbody>. Bailing hydration and performing ' +
            'full client-side render.'
        )
      }
    }
    // either not server-rendered, or hydration failed.
    // create an empty node and replace it
    oldVnode = emptyNodeAt(oldVnode)
  }
```

2、调用 `createElm` 方法

```js
// replacing existing element
  const oldElm = oldVnode.elm
  const parentElm = nodeOps.parentNode(oldElm)

  // create new node
  createElm(
    vnode,
    insertedVnodeQueue,
    // extremely rare edge case: do not insert if old element is in a
    // leaving transition. Only happens when combining transition +
    // keep-alive + HOCs. (#4590)
    oldElm._leaveCb ? null : parentElm,
    nodeOps.nextSibling(oldElm)
  )
}
```

`createElm`的作用是通过虚拟节点创建真实的 DOM 并插入到它的父节点中。`createElm` 函数的实现如下：

```js
function createElm(
  vnode,
  insertedVnodeQueue,
  parentElm,
  refElm,
  nested,
  ownerArray,
  index
) {
  if (isDef(vnode.elm) && isDef(ownerArray)) {
    // This vnode was used in a previous render!
    // now it's used as a new node, overwriting its elm would cause
    // potential patch errors down the road when it's used as an insertion
    // reference node. Instead, we clone the node on-demand before creating
    // associated DOM element for it.
    vnode = ownerArray[index] = cloneVNode(vnode)
  }

  vnode.isRootInsert = !nested // for transition enter check
  if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
    return
  }

  const data = vnode.data
  const children = vnode.children
  const tag = vnode.tag
  if (isDef(tag)) {
    if (process.env.NODE_ENV !== 'production') {
      if (data && data.pre) {
        creatingElmInVPre++
      }
      if (isUnknownElement(vnode, creatingElmInVPre)) {
        warn(
          'Unknown custom element: <' +
            tag +
            '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
          vnode.context
        )
      }
    }

    vnode.elm = vnode.ns
      ? nodeOps.createElementNS(vnode.ns, tag)
      : nodeOps.createElement(tag, vnode)
    setScope(vnode)

    /* istanbul ignore if */
    if (__WEEX__) {
      //……
    } else {
      createChildren(vnode, children, insertedVnodeQueue)
      if (isDef(data)) {
        invokeCreateHooks(vnode, insertedVnodeQueue)
      }
      insert(parentElm, vnode.elm, refElm)
    }

    if (process.env.NODE_ENV !== 'production' && data && data.pre) {
      creatingElmInVPre--
    }
  } else if (isTrue(vnode.isComment)) {
    vnode.elm = nodeOps.createComment(vnode.text)
    insert(parentElm, vnode.elm, refElm)
  } else {
    vnode.elm = nodeOps.createTextNode(vnode.text)
    insert(parentElm, vnode.elm, refElm)
  }
}
```

上面的代码中 `createComponent` 方法目的是尝试创建子组件，在当前这个 case 下它的返回值为 false；接下来判断 `vnode` 是否包含 tag，如果包含，先简单对 tag 的合法性在非生产环境下做校验，看是否是一个合法标签；然后再去调用平台的 DOM 操作去创建一个占位符元素。

```js
vnode.elm = vnode.ns
  ? nodeOps.createElementNS(vnode.ns, tag)
  : nodeOps.createElement(tag, vnode)
```

接下来调用 `createChildren` 方法创建子元素：

```js
createChildren(vnode, children, insertedVnodeQueue)

// createChildren 的实现
function createChildren(vnode, children, insertedVnodeQueue) {
  if (Array.isArray(children)) {
    if (process.env.NODE_ENV !== 'production') {
      checkDuplicateKeys(children)
    }
    for (let i = 0; i < children.length; ++i) {
      createElm(
        children[i],
        insertedVnodeQueue,
        vnode.elm,
        null,
        true,
        children,
        i
      )
    }
  } else if (isPrimitive(vnode.text)) {
    nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)))
  }
}
```

`createChildren` 的逻辑很简单，实际上就是遍历子虚拟节点，递归调用 `createElm` ，这是一种常用的深度优先的遍历算法，这里要注意的一点是在遍历过程中会把 `vnode.elm` 作为父容器 DOM 节点占位符传入。

调用 `invokeCreateHooks` 方法执行所有的 create 钩子并把 `vnode` push 到 `insertedVnodeQueue` 中：

```js
if (isDef(data)) {
  invokeCreateHooks(vnode, insertedVnodeQueue)
}

// invokeCreateHooks
function invokeCreateHooks(vnode, insertedVnodeQueue) {
  for (let i = 0; i < cbs.create.length; ++i) {
    cbs.create[i](emptyNode, vnode)
  }
  i = vnode.data.hook // Reuse variable
  if (isDef(i)) {
    if (isDef(i.create)) i.create(emptyNode, vnode)
    if (isDef(i.insert)) insertedVnodeQueue.push(vnode)
  }
}
```

最后调用 `insert` 方法把 DOM 插入到父节点中，因为是递归调用，子元素会优先调用 `insert`，所以整个 `vnode` 树节点的插入顺序是先子后父。`insert` 方法逻辑很简单，调用 `nodeOps` 的一些 DOM 操作辅助方法（调用原生 DOM 的 API）把子节点插入到父节点中。

```js
insert(parentElm, vnode.elm, refElm)

// insert 的实现
function insert(parent, elm, ref) {
  if (isDef(parent)) {
    if (isDef(ref)) {
      if (nodeOps.parentNode(ref) === parent) {
        nodeOps.insertBefore(parent, elm, ref)
      }
    } else {
      nodeOps.appendChild(parent, elm)
    }
  }
}
```

在 `createElm` 过程中，如果 `vnode` 节点不包含 `tag`，则它有可能是一个注释节点或者纯文本节点，可以直接插入到父元素中。在我们一开始就写好的例子中，最内层就是一个文本 `vnode` ，它的 `text` 值取的就是之前的 `this.message` 的值 `Hello Vue!`。

再回到 `patch` 方法，首次渲染我们调用了 `createElm` 方法，这里传入的 `parentElm` 是 `oldVnode.elm` 的父元素，也就是 body 元素，实际上整个过程就是递归创建了一个完整的 DOM 树并插入到 body 上。

最后，我们根据之前递归 `createElm` 生成的 `insertedVnodeQueue`，执行相关的 `insert` 钩子函数。

## 总结

通过上面的分析，我们从主线上把模板和数据如何渲染成最终的 DOM 的过程分析完毕了，通过下图可以更直观的看到从初始化 Vue 到最终渲染的整个过程。

![](../../images/new-vue.png)

## 扩展

#### 为什么 Vue.js 源码饶了一大圈，把实现 `patch` 的相关代码分塞到各个目录汇总？

因为前面介绍过， `patch` 是平台相关的，在 web 和 weex 这两个不同的环境下，它们把虚拟 DOM 映射到 “平台 DOM” 的方法是不同的，并且对“DOM” 包括的属性、模块创建和更新也不尽相同。因此每个平台都有各自的 `nodeOps` 和 `modules`，这些不同的代码需要托管在 `src/platforms` 这个大目录下的不同平台的目录下。

而不同平台的 `patch` 的主要逻辑部分又是相同的，所以这些公共部分托管在 `src/core/vdom` 这个大目录下。差异化的部分只需要通过参数来区别，并且通过 `createPatchFunction` 把差异化参数提前固化，这样不用每次调用 `patch` 的时候都传递 `nodeOps`和 `modules`了。

在这里， `nodeOps` 表示对“平台 DOM”的一些操作方法， `modules` 表示平台的一些模块，他们会在整个 `patch` 过程的不同阶段执行相应的钩子函数。

## 参考文档

- [Vue2.1.7 源码学习](http://hcysun.me/2017/03/03/Vue%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/#%E5%9B%9B%E3%80%81%E4%B8%80%E4%B8%AA%E8%B4%AF%E7%A9%BF%E5%A7%8B%E7%BB%88%E7%9A%84%E4%BE%8B%E5%AD%90)
- [Vue.js 源码数据驱动](https://ustbhuangyi.github.io/vue-analysis/v2/data-driven/)
