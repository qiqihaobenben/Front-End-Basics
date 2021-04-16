# Vue.js 源码—数据驱动视图（模板和数据如何渲染成最终 DOM）

Vue.js 的核心思想之一是数据驱动视图。所谓数据驱动视图，是指视图是由数据驱动生成的，我们要对视图进行修改，不是直接操作 DOM，而是通过修改数据触发视图变更。

数据驱动视图优点：

- 相比于传统的前端开发直接修改 DOM，数据驱动视图大大简化了代码量。
- 当交互复杂的时候，只关心数据的修改会让代码的逻辑变得非常清晰，并且非常利于维护。因为 DOM 变成了数据的映射，我们所有的逻辑都是对数据的修改，而不用操作 DOM。

我们从一个很简单的例子出发，从源码角度来分析 Vue 是如何实现通过简洁的模板语法声明式的将数据渲染为 DOM 的。分析过程会以主线代码为主，重要的分支逻辑放在之后单独分析。

> 强调一点：看源码的技巧是**注重大体框架，从宏观到微观**，当看一个项目代码的时候，最好是能找到一条主线，先把大体流程结构摸清楚，在深入到细节，逐项击破。

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

Vue 使用 `mergeOptions` 来处理我们条用 Vue 时传入的参数选项（opitons），然后将返回值赋值给 `this.$options`（vm === this），传给 `mergeOptions` 函数的参数有三个。首先是：`resolveConstructorOptions(vm.constructor)`

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
```

### 总结

Vue 初始化主要就干了几件事：使用策略对象合并参数选项、初始化生命周期、初始化事件中心，初始化渲染、调用 `beforeCreate` 生命周期钩子、初始化 injections、初始化 data、props、computed、watcher、初始化 provide、调用 `created` 生命周期钩子。

Vue 的初始化逻辑写的非常清楚，把不同的功能逻辑拆成一些单独的函数执行，让主线逻辑一目了然，这样的编程思想是非常值得借鉴和学习的。
