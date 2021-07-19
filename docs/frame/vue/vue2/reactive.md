# Vue.js 源码 — 深入响应式原理

> Vue.js 版本为 v2.6.14

上一篇主要讲的是初始化的过程，把原始数据最终映射到 DOM 中，但并没有涉及从数据变化到 DOM 变化的部分。而 Vue 的数据驱动除了数据渲染 DOM 之外，另一个很重要的体现就是数据的变更会触发 DOM 的变化。

前端开发最重要的两个工作：一个是把数据渲染到页面，另一个是处理用户交互。Vue 把数据渲染到页面的能力我们已经通过源码分析出原理了，但是由一些用户交互或者其他方面导致数据发生变化后，重新对页面渲染的原理我们还未分析。

本篇要用到的示例：

```html
<div id="app" @click="changeMsg">
  {{ message }}
</div>
```

```js
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
  },
  methods: {
    changeMsg() {
      this.message = 'Hello World!'
    },
  },
})
```

我们思考一下，当我们去修改 `this.message` 的时候，模板对应的插值也会渲染成新的数据，那么这一切是怎么做到的呢？

在分析之前，我们先直观的想一下，如果不用 Vue，我们实现这个需求最简单的方法：监听点击事件，修改数据，手动操作 DOM 重新渲染。这个过程和使用 Vue 的最大区别就是多了一步“手动操作 DOM 重新渲染”。虽然只有一步的区别，但这一步背后又隐藏着几个要处理的问题：

1. 我需要修改哪块的 DOM？
2. 我的修改效率和性能是不是最优的？
3. 我需要对数据每一次的修改都去操作 DOM 吗？
4. 我需要 case by case 去写修改 DOM 的逻辑吗？

我们使用 Vue 的时候，上面的几个问题 Vue 内部都帮我们做了。

## 构建响应式对象

### Object.defineProperty

Vue.js 实现响应式的核心是利用了 ES5 的 `Object.defineProperty`，这也是为什么 Vue.js 不能兼容 IE8 及以下浏览器的原因。

`Object.defineProperty` 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回这个对象。此处我们最关心传入的第三个参数 `descriptor` 中的 `get` 和 `set`，`get` 给属性提供一个 getter 方法，当我们访问该属性的时候会触发 getter 方法；`set`给属性提供一个 setter 方法，当我们对该属性做修改的时候会触发 setter 方法。

一旦对象拥有了 getter 和 setter，我们可以简单地把这个对象称为响应式对象。Vue.js 做了很多把普通对象变成响应式对象的工作。目的就是为了在我们访问数据以及修改数据的时候能自动执行一些逻辑：getter 做的事情是依赖收集，setter 做的事情是派发更新。

### initState

在 Vue 实例对象初始化阶段，`_init` 方法执行的时候，会执行 `initState(vm)` 方法，它定义在 `src/core/instance/state.js` 文件中：

```js
export function initState(vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)
  } else {
    observe((vm._data = {}), true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```

`initState` 方法主要是对 `props`、`methods`、`data`、`computed`、`watch` 等属性进行初始化操作。这里我们重点分析 `props` 和 `data`。

### initProps

```js
function initProps(vm: Component, propsOptions: Object) {
  const propsData = vm.$options.propsData || {}
  const props = (vm._props = {})
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  const keys = (vm.$options._propKeys = [])
  const isRoot = !vm.$parent
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false)
  }
  for (const key in propsOptions) {
    keys.push(key)
    const value = validateProp(key, propsOptions, propsData, vm)
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      const hyphenatedKey = hyphenate(key)
      if (
        isReservedAttribute(hyphenatedKey) ||
        config.isReservedAttr(hyphenatedKey)
      ) {
        warn(
          `"${hyphenatedKey}" is a reserved attribute and cannot be used as component prop.`,
          vm
        )
      }
      defineReactive(props, key, value, () => {
        if (!isRoot && !isUpdatingChildComponent) {
          warn(
            `Avoid mutating a prop directly since the value will be ` +
              `overwritten whenever the parent component re-renders. ` +
              `Instead, use a data or computed property based on the prop's ` +
              `value. Prop being mutated: "${key}"`,
            vm
          )
        }
      })
    } else {
      defineReactive(props, key, value)
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, `_props`, key)
    }
  }
  toggleObserving(true)
}
```

`initProps` 初始化 `props` 的主要过程就是遍历 `props` 选项。遍历的过程主要做了两件事：

- 一件是调用 `defineReactive` 函数把每个 `prop` 对应的值变成响应式，之后可以通过 `vm._props.xxx` 访问到 `props` 中对应的属性。
- 另一件是通过 `proxy` 把 `vm._props.xxx` 的访问代理到 `vm.xxx` 上。

#### defineReactive

`defineReactive` 的功能就是定义一个响应式对象，给对象动态添加 getter 和 setter，它定义在 `src/core/observer/index.js` 文件中：

```js
/**
 * Define a reactive property on an Object.
 */
export function defineReactive(
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    },
  })
}
```

`defineReactive` 函数最开始先初始化 `Dep` 对象的实例，接着获取传参 `obj` 中传参 `key` 的属性描述符，对于 `val` 是对象的情况会调用 `observe` 方法，这样就保证了无论 `obj` 的结构多复杂，它的所有子属性也能变成响应式的对象，我们访问或修改 `obj` 中一个嵌套较深的属性，也能触发 getter 和 setter。最后利用 `Object.defineProperty` 给 `obj` 的属性 `key` 添加 getter 和 setter。

#### proxy

proxy 的作用是把 `props` 上的属性代理到 `vm` 实例上，这就是为什么我们定义了在 props 中的属性，却可以直接通过 `vm` 实例访问到。`proxy` 定义在 `src/core/instance/state.js` 文件中：

```js
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop,
}

export function proxy(target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

`proxy` 方法的实现很简单，通过 `Object.defineProperty` 把 `target[sourceKey][key]` 的读写变成了对 `target[key]` 的读写。所以对于 `props` 而言，对 `vm._props.xxx` 的读写就变成了 `vm.xxx` 的读写，而我们通过 `vm._props.xxx` 又可以访问到定义在 `props` 中的属性，所以我们就可以通过 `vm.xxx` 访问到定义在 `props` 中的 `xxx` 属性了。

### initData

```js
function initData(vm: Component) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {}
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' &&
      warn(
        'data functions should return an object:\n' +
          'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
        vm
      )
  }
  // proxy data on instance
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = keys[i]
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(`Method "${key}" has already been defined as a data property.`, vm)
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' &&
        warn(
          `The data property "${key}" is already declared as a prop. ` +
            `Use prop default value instead.`,
          vm
        )
    } else if (!isReserved(key)) {
      proxy(vm, `_data`, key)
    }
  }
  // observe data
  observe(data, true /* asRootData */)
}
```

`initData` 在初始化 `data` 过程中主要做了两件事：

- 一件是对 `data` 函数返回的对象进行遍历，通过 `proxy` 把每一个 `vm._data.xxx` 都代理到 `vm.xxx` 上；
- 另一件是调用 `observe` 方法观测整个`data`的变化，把 `data` 也变成响应式

#### proxy

`proxy` 函数上面已经讲过了，跟前面分析的 `props` 同理，对于 `data` 而言，对 `vm._data.xxx` 的读写变成了对 `vm.xxx` 的读写，而我们通过 `vm._data.xxx` 又可以访问到定义在 `data` 函数返回对象中的属性，所以我们就可以通过 `vm.xxx` 访问到定义在 `data` 函数返回对象中的 `xxx` 属性了。

#### observe

`observe` 的功能就是用来检测数据变化的，它定义在 `src/core/observer/index.js` 文件中：

```js
/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
export function observe(value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}
```

`observe` 方法的作用就是尝试给非 VNode 的对象类型数据创建一个 `Observer` 实例，如果已经是一个 `Observer` 实例，就直接返回，否则在满足一定条件下去实例化一个 `Observer` 对象。

#### Observer

`Observer` 是一个类，它的作用是给对象的属性添加 getter 和 setter，用于依赖收集和派发更新，它也是定义在 `src/core/observer/index.js` 文件中：

```js
/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
export class Observer {
  value: any
  dep: Dep
  vmCount: number // number of vms that have this object as root $data

  constructor(value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk(obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray(items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}
```

`Observer` 类的逻辑很简单，首先实例化 `Dep` 对象，接着通过执行 `def` 函数把自身实例添加到数据对象 `value` 的 `__ob__` 属性上， `def` 定义在 `src/core/util/lang.js` 文件中：

```js
/**
 * Define a property.
 */
export function def(obj: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true,
  })
}
```

`def` 函数是一个非常简单的 `Object.defineProperty` 的封装，这就是为什么在开发中打印 `data` 上对象类型的数据，会发现该对象多了一个 `__ob__` 属性。

再回到 `Observer` 类，接下来会对 `value` 做判断，如果是数组就会调用 `observeArray` 方法，否则就对纯对象调用 `walk` 方法。可以看到 `observeArray` 是遍历数组再次调用 `observe` 方法，而 `walk` 方法是遍历对象的 key 调用 `defineReactive` 方法。`defineReactive` 上面介绍了，它的功能就是定义一个响应式对象，给对象动态添加 getter 和 setter。

## 依赖收集

通过上一小节的分析我们了解了 Vue 会把普通对象变成响应式对象，响应式对象 getter 的相关逻辑就是在做依赖收集。

我们回顾一下 getter 部分的逻辑：

```js
/** src/core/observer/index.js */
export function defineReactive(
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    //……
  })
}
```

这段代码我们只需关注 2 个地方：

- 一个是 `const dep = new Dep()` 实例化一个 `Dep`。
- 另一个是在 `get` 函数中通过 `dep.depend` 做依赖收集，这里还有个对 `childOb` 判断的逻辑。

### Dep

`Dep` 是整个 getter 依赖收集的核心，它定义在 `src/core/observer/dep.js` 中：

```js
import type Watcher from './watcher'
import { remove } from '../util/index'
import config from '../config'

let uid = 0
/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
export default class Dep {
  static target: ?Watcher
  id: number
  subs: Array<Watcher>

  constructor() {
    this.id = uid++
    this.subs = []
  }

  addSub(sub: Watcher) {
    this.subs.push(sub)
  }

  removeSub(sub: Watcher) {
    remove(this.subs, sub)
  }

  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify() {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id)
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null
const targetStack = []

export function pushTarget(target: ?Watcher) {
  targetStack.push(target)
  Dep.target = target
}

export function popTarget() {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}
```

`Dep` 是一个 Class，它定义了一些属性和方法，这里需要特别注意的是它有一个静态属性 `target`，它会存放一个全局唯一的 `Watcher`，这是一个巧妙的设计，因为在同一时间只能有一个全局的 `Watcher` 被计算，另外它的自身属性 `subs` 是一个 `Watcher` 的数组。

### Watcher

`Dep` 实际上就是对 `Watcher` 的一种管理，`Dep` 脱离 `Watcher` 单独存在是没有意义的，为了完整的讲清楚依赖收集过程，需要了解 `Watcher` 的一些相关实现， `Watcher` 定义在 `src/core/observer/watcher.js` 文件中：

```js
let uid = 0

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
export default class Watcher {
  vm: Component
  expression: string
  cb: Function
  id: number
  deep: boolean
  user: boolean
  lazy: boolean
  sync: boolean
  dirty: boolean
  active: boolean
  deps: Array<Dep>
  newDeps: Array<Dep>
  depIds: SimpleSet
  newDepIds: SimpleSet
  before: ?Function
  getter: Function
  value: any

  constructor(
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    this.vm = vm
    if (isRenderWatcher) {
      vm._watcher = this
    }
    vm._watchers.push(this)
    // options
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
      this.before = options.before
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb
    this.id = ++uid // uid for batching
    this.active = true
    this.dirty = this.lazy // for lazy watchers
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.expression =
      process.env.NODE_ENV !== 'production' ? expOrFn.toString() : ''
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = noop
        process.env.NODE_ENV !== 'production' &&
          warn(
            `Failed watching path: "${expOrFn}" ` +
              'Watcher only accepts simple dot-delimited paths. ' +
              'For full control, use a function instead.',
            vm
          )
      }
    }
    this.value = this.lazy ? undefined : this.get()
  }

  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  get() {
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      this.cleanupDeps()
    }
    return value
  }

  /**
   * Add a dependency to this directive.
   */
  addDep(dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }

  /**
   * Clean up for dependency collection.
   */
  cleanupDeps() {
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  },
  //……
}
```

`Watcher` 是一个 Class，在它的构造函数中，定义了一些和 `Dep` 相关的属性：

```js
this.deps = []
this.newDeps = []
this.depIds = new Set()
this.newDepIds = new Set()
```

其中，`this.deps` 和 `this.newDeps` 表示 `Watcher` 实例持有的 `Dep` 实例数组；而 `this.depIds` 和 `this.newDepIds` 分别代表 `this.deps` 和 `this.newDeps` 的 `id` Set（这个 Set 是 ES6 的数据结构，Vue.js 做了兼容，在没有原生 Set 的环境中，自己实现了一个简单的 Set，代码在 `src/core/util/env.js`中）。

`Watcher` 还定义了一些原型的方法，和依赖收集相关的有 `get`、`addDep` 和 `cleanupDeps` 方法。

### 依赖收集过程分析

现在我们知道，当访问数据对象的属性时，会触发它们的 getter 进行依赖收集，那么这些对象最开始是什么时候被访问的呢？

在 Vue 的 mount 过程是通过 `mountComponent` 函数，其中有一段比较重要的逻辑：

```js
/** src/core/instance/lifecycle.js */

updateComponent = () => {
  vm._update(vm._render(), hydrating)
}

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
```

当我们实例化一个渲染 `watcher` 的时候，首先进入 `watcher` 的构造函数逻辑（可以查看 `Watcher` 源码），然后会执行它的 `this.get()` 方法，进入 `get` 方法首先会执行：

```js
/** src/core/observer/watcher.js 的 get 方法中*/
pushTarget(this)
```

`pushTarget` 定义在 `src/core/observer/dep.js` 文件中：

```js
Dep.target = null
const targetStack = []

export function pushTarget(target: ?Watcher) {
  targetStack.push(target)
  Dep.target = target
}
```

实际上就是把 `Dep.target` 赋值为当前的渲染 `watcher` 并压入栈（为了恢复用）。接着 `get` 方法中又执行了：

```js
/** src/core/observer/watcher.js 的 get 方法中*/
value = this.getter.call(vm, vm)
```

`this.getter` 是实例化时的传参 `expOrFn`，也就是`mountComponent` 函数中的 `updateComponent` 函数，所以实际上就是在执行：

```js
vm._update(vm._render(), hydrating)
```

它会先执行 `vm._render()` 方法，因为之前分析过这个方法会生成渲染 VNode，并且在这个过程中会对 `vm` 上的数据进行访问，这个时候就触发了数据对象的 getter。

因为每个数据对象都已经变成了响应式对象，它们的属性 getter 都只有一个 `dep`，在触发 getter 的时候会调用 `dep.depend()` 方法，也就会执行 `Dep.target.addDep(this)`。

刚才我们提到这个时候 `Dep.target` 已经被赋值为渲染 `watcher`，那么现在就是执行渲染 `watcher` 的 `addDep` 方法：

```js
/** src/core/observer/watcher.js */
addDep (dep: Dep) {
  const id = dep.id
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id)
    this.newDeps.push(dep)
    // 避免重复订阅
    if (!this.depIds.has(id)) {
      dep.addSub(this)
    }
  }
}
```

这时候会做一些逻辑判断（保证同一数据不会被添加多次）后执行 `dep.addSub(this)`，就是执行 `this.subs.push(sub)`，也就是说把当前的 `watcher` 订阅到这个数据持有的 `dep` 的 `subs` 中，这个目的是为后续数据变化时候能通知到哪些 `subs` 做准备。

所以在 `vm._render()` 过程中，会触发所有数据的 getter，这样实际上已经完成了依赖收集的过程。那么到这里就结束了么，其实没有，在完成依赖收集后，还有几个逻辑要执行。

```js
/** src/core/observer/watcher.js 的 get 方法中*/
if (this.deep) {
  traverse(value) // 方法定义在 src/core/observer/traverse.js 中
}
```

首先是如果 `this.deep` 为 true，就需要递归的去访问 `value`， 触发它所有子项的 getter。

```js
/** src/core/observer/watcher.js 的 get 方法中*/
popTarget()
```

```js
/** src/core/observer/dep.js */
export function popTarget() {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}
```

然后调用 `popTarget` 把 `Dep.target` 恢复成上一个状态，因为当前 vm 数据的依赖收集已经完成，那么对应的渲染 `watcher` 即 `Dep.target` 也需要改变。

```js
/** src/core/observer/watcher.js 的 get 方法中*/
this.cleanupDeps()

/** src/core/observer/watcher.js 的 Watcher 类中*/
cleanupDeps () {
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }

```

Vue 考虑特别细的一点是除了有依赖收集，还有依赖清空。考虑到 Vue 是数据驱动的，所以每次数据变化都会重新 render，那么 `vm._render` 方法又会再次执行，并再次触发数据的 getters 。

`Watcher` 在构造函数中会初始化 2 个 `Dep` 实例数组，`newDeps`表示新增加的 `Dep` 实例数组，而 `deps` 表示上一次添加的 `Dep` 实例数组。在执行 `cleanupDeps` 函数的时候，会首先遍历 `deps`， 如果 `newDepIds` 没有对应的 id ，就移除 `dep.subs` 数组对应的 `Watcher` 的订阅，然后把 `newDepIds` 和 `depIds` 交换，`newDeps` 和 `deps` 交换，并把 `newDepIds` 和 `newDeps` 清空。

**我们要思考一下，在添加 `deps` 的订阅过程，已经通过 `id` 去重避免重复订阅了，那么为什么还需要做 `deps` 订阅的移除呢？**

考虑到一种场景，我们的模板会根据 `v-if` 去渲染不同子模块 a 和 b，当我们满足某种条件去渲染 a 的时候，会访问到 a 中的数据，这时候我们触发了 a 使用的数据的 getter ，做了依赖收集，那么当我们去修改 a 的数据的时候，理应通知到这些订阅者。但是如果我们一旦改变条件渲染了 b 模板，又会触发 b 使用的数据的 getter，如果没有依赖移除的过程，那么这时候去修改 a 模板的数据，还是会通知 a 数据的订阅的回调，这显然是有浪费的。

因此 Vue 设计了在每次添加完新的订阅，会移除掉旧的订阅，这样在我们刚才的场景中，如果渲染 b 模板的时候去修改 a 模板的数据，a 数据订阅回调已经被移除了，所以不会有任何浪费。

## 派发更新

上一小节主要是对依赖收集的分析，收集依赖的目的是为了当我们修改数据导致这些响应式数据发生变化，从而触发它们的 setter 的时候，能知道应该通知哪些订阅者去做相应的逻辑处理，我们把这个过程叫做派发更新。

我们先来回顾一下 `src/core/observer/index.js` 中 `defineReactive` 的 setter 部分的逻辑：

```js
/**
 * Define a reactive property on an Object.
 */
export function defineReactive(
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    //……
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    },
  })
}
```

setter 的逻辑有 2 个关键的点

- 一个是 `childOb = !shallow && observe(newVal)` ，如果 `shallow` 为 false 的情况，会把新设置的值变成一个响应式对象；
- 另一个是 `dep.notify()`，通知所有的订阅者，这是派发更新的关键。

### 派发更新过程分析

当我们在组件中对响应式数据做了修改，就会触发 setter 的逻辑，最后调用 `dep.notify()` 方法，`notify` 方法是 `Dep` 的一个实例方法，定义在 `src/core/observer/dep.js` 文件中：

```js
export default class Dep {
  static target: ?Watcher
  id: number
  subs: Array<Watcher>

  constructor() {
    this.id = uid++
    this.subs = []
  }
  //……

  notify() {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id)
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}
```

`notify`  方法逻辑非常简单，遍历 `subs` 也就是 `watcher` 的实例数组，然后调用每一个 `watcher` 的 `update` 方法，此方法定义在 `src/core/observer/watcher.js` 文件中：

```js
export default class Watcher {
  //……

  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  update() {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      this.run()
    } else {
      queueWatcher(this)
    }
  }

  //……
}
```

在一般组件数据更新的场景，会走到最后一个 `queueWatcher(this)` 的逻辑，`queueWatcher` 函数定义在 `src/core/observer/scheduler.js` 文件中：

```js
const queue: Array<Watcher> = []
let has: { [key: number]: ?true } = {}
let waiting = false
let flushing = false

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
export function queueWatcher(watcher: Watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      queue.push(watcher)
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    // queue the flush
    if (!waiting) {
      waiting = true

      if (process.env.NODE_ENV !== 'production' && !config.async) {
        flushSchedulerQueue()
        return
      }
      nextTick(flushSchedulerQueue)
    }
  }
}
```

这里引入了一个队列的概念，这也是 Vue 在做派发更新的时候的一个优化，它并不会每次数据改变都触发 `watcher` 的回调，而是把这些 `watcher` 先添加到一个队列里，然后在 `nextTick` 后执行 `flushSchedulerQueue`。

上面的代码中有几个细节需要注意一下，首先用 `has` 对象保证同一个 `watcher` 只添加一次，接着对 `flushing` 进行判断，如果 `flushing` 是 false，就把 `watcher` 正常添加到队列中，else 部分的逻辑稍后再说。最后通过 `waiting` 保证 `nextTick(flushSchedulerQueue)` 的正在运行的逻辑只有一个。`nextTick` 作用就是异步的去执行 `flushSchedulerQueue`。

`flushSchedulerQueue` 定义在 `src/core/observer/scheduler.js` 文件中：

```js
let flushing = false
let index = 0

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue() {
  currentFlushTimestamp = getNow()
  flushing = true
  let watcher, id

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort((a, b) => a.id - b.id)

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    if (watcher.before) {
      watcher.before()
    }
    id = watcher.id
    has[id] = null
    watcher.run()
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' +
            (watcher.user
              ? `in watcher with expression "${watcher.expression}"`
              : `in a component render function.`),
          watcher.vm
        )
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  const activatedQueue = activatedChildren.slice()
  const updatedQueue = queue.slice()

  resetSchedulerState()

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue)
  callUpdatedHooks(updatedQueue)

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush')
  }
}
```

梳理一下上面代码的几个重要逻辑：

- 队列排序

`queue.sort((a, b) => a.id - b.id)` 对队列做了从小到大的排序，这么做主要确保以下几点：

1. 组件的更新由父到子：因为父组件的创建过程是先于子组件的，所以 `watcher` 的创建也是先父后子，更新的执行顺序也应该保持先父后子。
2. 用户自定义 `watcher` 要优先于渲染 `watcher`执行：因为用户自定义 `watcher` 是在渲染 `watcher` 之前创建的。
3. 如果一个组件在父组件的 `watcher` 执行期间被销毁，那么它对应的 `watcher` 执行都要被跳过，所以父组件的 `watcher` 应该先执行。

- 队列遍历

在对 `queue` 排序后，接着就是要对它做遍历，拿到对应的 `watcher`，执行 `watcher.run()`。这里需要注意一个细节，在遍历的时候每次都会对 `queue.length` 求值，因为在 `watcher.run()` 的时候，很可能用户会再添加新的 `watcher`，这样会再次执行到 `queueWatcher`，如下：

```js
export function queueWatcher(watcher: Watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      queue.push(watcher)
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    //……
  }
}
```

可以看到，这时候 `flushing` 为 true，就会执行到 else 逻辑，然后就会从后往前找，找到第一个待插入 `watcher` 的 id 比当前队列中 `watcher` 的 id 大的位置。把 `watcher` 插入到这个位置，因此 `queue` 的长度发生了变化。

- 状态恢复

这个过程就是执行 `resetSchedulerState` 函数，它定义在 `src/core/observer/scheduler.js` 文件中：

```js
const queue: Array<Watcher> = []
const activatedChildren: Array<Component> = []
let has: { [key: number]: ?true } = {}
let circular: { [key: number]: number } = {}
let waiting = false
let flushing = false
let index = 0

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState() {
  index = queue.length = activatedChildren.length = 0
  has = {}
  if (process.env.NODE_ENV !== 'production') {
    circular = {}
  }
  waiting = flushing = false
}
```

上面的代码逻辑非常简单，就是把控制流程状态的一些变量恢复到初始值，把 `watcher` 队列清空。

接下来我们继续分析 `watcher.run()` 的逻辑，它定义在 `src/core/observer/watcher.js` 文件中：

```js
export default class Watcher {
  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
  run() {
    if (this.active) {
      const value = this.get()
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // set new value
        const oldValue = this.value
        this.value = value
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue)
          } catch (e) {
            handleError(e, this.vm, `callback for watcher "${this.expression}"`)
          }
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }
}
```

`run` 函数先通过 `this.get()` 得到它当前的值，然后做判断，如果满足新旧值不等、新值是对象类型或是 `deep` 模式，这个三个条件的任意一个，则执行 `watcher` 的回调，注意回调函数执行的时候会把第一个和第二个参数分别设置为新值 `value` 和 旧值 `oldValue`，这就是当我们添加自定义 `watcher` （在组件中写`watch`）的时候能在回调函数的参数中拿到新旧值的原因。

对于渲染 `watcher` 而言，它在执行 `this.get()` 方法求值的时候，会执行 `getter` 方法，也就是传入 `Watcher` 构造函数的第二个参数 `expOrFn`，也就是下面这段代码：

```js
/** src/core/instance/lifecycle.js */
updateComponent = () => {
  vm._update(vm._render(), hydrating)
}
```

所以这就是当我们去修改组件相关的响应式数据的时候，会触发组件重新渲染的原因，接着就会重新执行 `patch` 过程，但是它和首次渲染有所不同，之后我们再详细介绍。

## 检测变化的注意事项

Vue 在检测数据变化时，有一些特殊情况是需要注意的，我们可以从源码的角度来看 Vue 是如何处理这些特殊情况的。

### 对象添加新属性

对于使用 `Object.defineProperty` 实现的响应式对象，当我们去给这个对象添加一个新的属性的时候，是不能够触发它的 setter 的，比如：

```js
var vm = new Vue({
  data: {
    a: 1,
  },
})
// vm.b 是非响应式的
vm.b = 2
```

但是添加新属性的场景我们在平时开发中会经常遇到，Vue 为了解决这个问题，定义了一个全局 API `Vue.set` 方法，该方法是在 `initGlobalAPI` 中初始化的， `initGlobalAPI` 定义在 `src/core/global-api/index.js` 文件中：

```js
export function initGlobalAPI(Vue: GlobalAPI) {
  // ……

  Vue.set = set

  // ……
}
```

这个 `set` 方法定义在 `src/core/observer/index.js` 文件中：

```js
/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
export function set(target: Array<any> | Object, key: any, val: any): any {
  if (
    process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(
      `Cannot set reactive property on undefined, null, or primitive value: ${(target: any)}`
    )
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  const ob = (target: any).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' &&
      warn(
        'Avoid adding reactive properties to a Vue instance or its root $data ' +
          'at runtime - declare it upfront in the data option.'
      )
    return val
  }
  if (!ob) {
    target[key] = val
    return val
  }
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}
```

`set` 方法接受 3 个参数：

- `target` 可能是数组也可能是对象；
- `key` 代表的是数组的下标或者对象的键值；
- `val` 代表添加的值。

主要的逻辑是，首先判断如果 `target` 是数组且 `key` 是一个合法的下标，则通过 `splice` 去添加进数组然后返回，这里的 `splice` 其实已经经过 Vue 处理，不是原生数组的 `splice` 了。接着又判断 `key` 如果已经存在于 `target` 中，则直接赋值返回，因为这样的变化是可以观测到的。接着再获取到 `target.__ob__` 并赋值给 `ob`，之前分析过它是在 `Observer` 的构造函数执行的时候初始化的，表示 `Observer` 的一个实例，如果它不存在，则说明 `target` 不是响应式的对象，则直接赋值并返回。最后通过 `defineReactive(ob.value, key, val)` 把新添加的属性变成响应式对象，然后再通过 `ob.dep.notify()` 手动的触发依赖通知。还记得我们在给对象添加 `getter` 的时候有这么有一段逻辑：

```js
export function defineReactive(
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  //……

  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    //……
  })
}
```

在 getter 过程中判断了 `childOb`，并调用了 `childOb.dep.depend()` 收集了依赖，这就是为什么执行 `Vue.set` 的时候通过 `ob.dep.notify()` 能够通知到 `watcher` ，从而让添加新的属性到对象也可以检测到变化。这里如果 `value` 是个数组，那么就通过 `dependArray` 把数组每个元素做依赖收集。

#### 扩展

除了有 `Vue.set` 全局 API，还有 `Vue.del` 全局 API，它的实现跟 `Vue.set` 大同小异，这里直接看一下代码：

```js
/** src/core/observer/index.js */
/**
 * Delete a property and trigger change if necessary.
 */
export function del(target: Array<any> | Object, key: any) {
  if (
    process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(
      `Cannot delete reactive property on undefined, null, or primitive value: ${(target: any)}`
    )
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1)
    return
  }
  const ob = (target: any).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' &&
      warn(
        'Avoid deleting properties on a Vue instance or its root $data ' +
          '- just set it to null.'
      )
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key]
  if (!ob) {
    return
  }
  ob.dep.notify()
}
```

### 数组

Vue 不能检测到以下数组的变动：

1. 当你利用索引直接设置一个项时，例如： `vm.items[indexOfItem] = newValue`
2. 当你修改数组的长度时，例如 `vm.items.length = newLength`

对于第一种情况，可以使用：`Vue.set(items, indexOfItem. newValue)`；而对于第二种情况，可以使用 `vm.items.splice(newLength)`。

上面我们也看到 `Vue.set` 的实现中，当 `target` 是数组的时候，也是通过 `target.splice(key, 1, val)` 来添加的，下面我们就需要看一下，`splice` 到底做了些什么，能让添加的值也变成响应式的？

之前我们分析过，在通过 `observe` 方法去观察对象的时候会实例化 `Observer` ，在 `Observer` 构造函数中专门对数组做了处理，这个逻辑定义在 `src/core/observer/index.js` 文件中。

```js
export class Observer {
  value: any
  dep: Dep
  vmCount: number // number of vms that have this object as root $data

  constructor(value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      this.observeArray(value)
    } else {
      //……
    }
  }

  //……
}
```

现在我们只关注 `value` 是 Array 的情况，先判断了 `hasProto`，即 `'__proto__' in {}` 实际上就是判断对象中是否存在 `__proto__` ，如果存在则调用 `protoAugment` ，否则指向 `copyAugment`，这两个函数的定义如下：

```js
/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment(target, src: Object) {
  /* eslint-disable no-proto */
  target.__proto__ = src
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment(target: Object, src: Object, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}
```

`protoAugment` 方法是直接通过 `target.__proto__` 把原型直接修改为 `src`，而 `copyAugment` 方法是遍历 keys，通过 `def` 也就是 `Object.defineProperty` 去定义它自身的属性值。对于大部分现代浏览器而言，都会走到 `protoAugment` 逻辑，那么实际上就是把 `value` 的原型指向了 `arrayMethods`，`arrayMethods` 定义在 `src/core/observer/array.js` 文件中：

```js
import { def } from '../util/index'

const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse',
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function(method) {
  // cache original method
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator(...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // notify change
    ob.dep.notify()
    return result
  })
})
```

可以看到，`arrayMethods` 首先继承了 `Array`，然后对数组中所有能改变数组自身的方法，如 `push`、`pop` 等这些方法进行重写。重写后的方法会先执行原生方法本身原有的逻辑，并对能增加数组元素的 3 个方法 `push`、`unshift`、`splice` 做了判断，获取到插入的值，然后把新添加的值变成一个响应式对象。最后调用 `ob.dep.notify` 手动触发依赖通知。这就很好地解释了之前的示例中调用 `vm.items.splice(newLength)` 方法可以检测到变化。

## 参考文档

- [Vue.js 源码数据驱动](https://ustbhuangyi.github.io/vue-analysis/v2/data-driven/)
