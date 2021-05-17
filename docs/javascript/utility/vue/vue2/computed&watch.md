# Vue.js 源码 — 计算属性&侦听属性

Vue 的组件对象支持了计算属性 `computed` 和侦听属性 `watch` 2 个选项，那么究竟什么时候该用 `computed` 什么时候该用 `watch`？我们可以从源码实现的角度来分析他们两者有什么区别，然后再看怎么用。

## computed

计算属性的初始化是发生在 Vue 实例初始化阶段的 `initState` 函数中，执行了 `if (opts.computed) initComputed(vm, opts.computed)`，`initComputed` 定义在 `src/core/instance/state.js` 文件中：

```js
const computedWatcherOptions = { lazy: true }

function initComputed(vm: Component, computed: Object) {
  // $flow-disable-line
  const watchers = (vm._computedWatchers = Object.create(null))
  // computed properties are just getters during SSR
  const isSSR = isServerRendering()

  for (const key in computed) {
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn(`Getter is missing for computed property "${key}".`, vm)
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      )
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    } else if (process.env.NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm)
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(`The computed property "${key}" is already defined as a prop.`, vm)
      }
    }
  }
}
```

函数首先创建 `vm._computedWatchers` 为一个空对象，接着对 `computed` 对象做遍历，拿到计算属性的每一个 `userDef`，然后尝试获取这个 `userDef` 对应的 `getter` 函数，拿不到则在开发环境下发出警告。接下来为每一个 `getter` 创建一个 `watcher`，这个 `watcher` 和渲染 `watcher` 有一点很大的不同，它是一个 `lazy watcher`，创建 watcher 的时候传入了 `computedWatcherOptions`，即 `const computedWatcherOptions = { lazy: true }`。最后判断如果 `key` 不是 `vm` 的属性，则调用 `defineComputed(vm, key, userDef)`，否则，判断计算属性的 `key` 是否已经被 `data` 或者 `props` 所占用，如果是的话则在开发环境发出相应的警告。

接下来需要重点关注 `defineComputed` 的实现：

```js
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop,
}
//……

export function defineComputed(
  target: any,
  key: string,
  userDef: Object | Function
) {
  const shouldCache = !isServerRendering()
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef)
    sharedPropertyDefinition.set = noop
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop
    sharedPropertyDefinition.set = userDef.set || noop
  }
  if (
    process.env.NODE_ENV !== 'production' &&
    sharedPropertyDefinition.set === noop
  ) {
    sharedPropertyDefinition.set = function() {
      warn(
        `Computed property "${key}" was assigned to but it has no setter.`,
        this
      )
    }
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

这段逻辑很简单，其实就是利用 `Object.defineProperty` 给计算属性对应的 `key` 值添加 getter 和 setter，setter 通常是计算属性是一个对象，并且拥有 `set` 方法的时候才有，否则是一个空函数。在平时的开发场景中，计算属性有 setter 的情况比较少，我们重点关注一下 getter 部分，非 SSR 下，`shouldCache` 为 `true`，最终 getter 对应的是 `createComputedGetter(key)` 的返回值。 `createComputedGetter` 定义如下：

```js
function createComputedGetter(key) {
  return function computedGetter() {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate()
      }
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}
```

`createComputedGetter` 返回一个函数 `computedGetter` ，它就是计算属性对应的 getter。

整个计算属性的初始化过程到此结束，我们再来看一下计算属性生成的是 `lazy watcher`，它和普通的 `watcher` 有什么区别呢，为了更加直观，接下来我们通过一个例子来分析 `lazy watcher` 的实现。

```js
var vm = new Vue({
  data: {
    firstName: 'Foo',
    lastName: 'Bar',
  },
  computed: {
    fullName: function() {
      return this.firstName + ' ' + this.lastName
    },
  },
})
```

当初始化这个 `lazy watcher` 实例的时候，构造函数部分逻辑稍微有些不同：

```js
/** src/core/observer/watcher.js */

constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    //……

    this.value = this.lazy
      ? undefined
      : this.get()
  }
```

可以发现 `lazy watcher` 并不会立即求值，然后当我们的 `render` 函数执行访问到 `this.fullName` 的时候，就触发了计算属性的 `getter`，它会拿到计算属性对应的 `lazy watcher`，然后判断 `watcher.dirty` 为 `true`，执行 `watcher.evaluate()`, 再判断 `Dep.target` 为 `true`， 执行 `watcher.depend()` 。

```js
/**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  evaluate () {
    this.value = this.get()
    this.dirty = false
  }

  /**
   * Depend on all deps collected by this watcher.
   */
  depend () {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }
```

`evaluate` 逻辑非常简单，通过 `this.get()` 求值，然后把 `this.dirty` 设置为 `false`。

在求值过程中，会先执行 `pushTarget(this)`，即把当前 `lazy watcher` 赋值给 `Dep.target`，然后执行 `value = this.getter.call(vm, vm)`，这实际上就是执行了计算属性整理后的 `getter` 函数，在我们这个例子就是执行了 `return this.firstName + ' ' + this.lastName`。这里需要特别注意的是，由于 `this.firstName` 和 `this.lastName` 都是响应式对象，这里会触发他们的 getter，根据我们之前的分析，他们会在自身持有的 `dep` 中添加当前正在计算的 `watcher`，这个时候 `Dep.target` 就是这个 `lazy watcher`。并且也会把自身持有的 `dep` 添加到当前正在计算的 `lazy watcher` 的 `this.newDeps` 中，在 `this.get` 执行后期，会执行 `popTarget()` 把 `Deps.target` 变成之前的渲染 `watcher`，还会执行 `this.cleanupDeps()`，其中有一个逻辑就是 `this.deps = this.newDeps`。

`watcher.evaluate()` 执行完毕后，会判断 `Dep.target`，此时 `Dep.target` 是渲染 `watcher`，所以就会执行 `watcher.depend()`，它的逻辑很简单，就是把 `lazy.watcher` 中的 `this.deps` 遍历，将渲染 `watcher` 加到相关的响应式对象的 `dep` 中，在本例中就是 `this.firstName` 和 `this.lastName` ，它们会将当前渲染 `watcher` 添加到自身的 deps 中。这样，之后计算属性依赖的数据做了修改，就会触发渲染 `watcher` 的更新。

上面是计算属性求值过程，那么接下来看一下它依赖的数据变化后的逻辑。

一旦我们对计算属性依赖的数据做修改，则会触发 setter 过程，通知所有订阅它变化的 `watcher` 更新，执行 `watcher.update()` 方法：

```js
/** src/core/observer/watcher.js */

/**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  update () {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      this.run()
    } else {
      queueWatcher(this)
    }
  }
```

`lazy watcher` 只会把 `this.dirty` 改为 `true`，即只有当下次再访问这个计算属性的时候才会重新求值。而我们上面已经知道了，计算属性依赖的数据修改后，会触发渲染 `watcher` 的更新，势必会再次访问计算属性，因为 `this.dirty` 又是 `true` 了，所以会再次执行 `watcher.evaluate()`。

## watch

侦听属性的初始化也是发生在 Vue 实例初始化阶段的 `initState` 函数中，在 `computed` 初始化之后，执行了：

```js
if (opts.watch && opts.watch !== nativeWatch) {
  initWatch(vm, opts.watch)
}
```

`initWatch` 也是定义在 `src/core/instance/state.js` 文件中：

```js
function initWatch(vm: Component, watch: Object) {
  for (const key in watch) {
    const handler = watch[key]
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else {
      createWatcher(vm, key, handler)
    }
  }
}
```

这里就是对 `watch` 对象做遍历，拿到每一个 `handler`，因为 Vue 是支持 `watch` 的同一个 `key` 对应多个 `handler`，所以如果 `handler` 是一个数组，则遍历这个数组，对数组的每一项分别调用 `createWatcher`，否则直接调用 `createWatcher`：

```js
function createWatcher(
  vm: Component,
  keyOrFn: string | Function,
  handler: any,
  options?: Object
) {
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
  return vm.$watch(keyOrFn, handler, options)
}
```

这里的逻辑也很简单，首先对 `handler` 的类型做判断，拿到它最终的回调函数，最后调用 `vm.$watch(keyOrFn, handler, options)`，`$watch` 是 Vue 原型上的方法，它是在执行 `stateMixin` 的时候定义的：

```js
Vue.prototype.$watch = function(
  expOrFn: string | Function,
  cb: any,
  options?: Object
): Function {
  const vm: Component = this
  if (isPlainObject(cb)) {
    return createWatcher(vm, expOrFn, cb, options)
  }
  options = options || {}
  options.user = true
  const watcher = new Watcher(vm, expOrFn, cb, options)
  if (options.immediate) {
    cb.call(vm, watcher.value)
  }
  return function unwatchFn() {
    watcher.teardown()
  }
}
```

也就是说，侦听属性 `watch` 最终会调用 `$watch` 方法，这个方法首先判断 `cb` 如果是一个对象，则调用 `createWatcher` 方法，这是因为 `$watch` 方法是用户可以直接调用的，它可以传递一个对象，也可以传递函数。接着执行 `const watcher = new Watcher(vm, expOrFn, cb, options)` 实例化了一个 `watcher`，这里需要注意一点这是一个 `user watcher`， 因为 `options.user = true`。通过实例化 `watcher` 的方式，会把这个 `user watcher` 添加到要 `watch` 的数据的自身 `deps` 中，一旦我们 `watch` 的数据发生了变化，它最终会执行 `user watcher` 的 `run` 方法，执行回调函数 `cb`，并且如果我们设置了 `immediate` 为 `true`，则直接执行回调函数 `cb`。最后返回一个 `unwatchFn` 方法，它会调用 `watcher.teardown()` 方法去移除这个 `watcher`。

所以本质上侦听属性也是基于 `Watcher` 实现的，它是一个 `user watcher`。

其实 `Watcher` 支持了不同的类型，下面我们梳理一下它有哪些类型以及他们的作用。

## Watcher options

`Watcher` 构造函数对 `options` 做了如下处理：

```js
// options
if (options) {
  this.deep = !!options.deep
  this.user = !!options.user
  this.lazy = !!options.lazy
  this.sync = !!options.sync
} else {
  this.deep = this.user = this.lazy = this.sync = false
}
```

所以 `watcher` 总共有 4 种类型，我们来一一分析它们，看看不同的类型执行的逻辑有哪些差异？

### deep watcher

通常，如果我们想对一个对象做深度观测的时候，需要设置这个属性为 true，考虑到这种情况：

```js
var vm = new Vue({
  data() {
    a: {
      b: 1
    }
  },
  watch: {
    a: {
      handler(newVal) {
        console.log(newVal)
      },
    },
  },
})
vm.a.b = 2
```

这个时候是不会 log 任何数据的，因为我们是 watch 了 `a` 对象，只触发了 `a` 的 getter，并没有触发 `a.b` 的 getter，所以并没有订阅 `a.b` 的变化，导致我们对 `vm.a.b = 2` 赋值的时候，虽然触发了 setter，但没有可通知的对象，所以也并不会触发 `watch` 的回调函数。

而我们只需要对代码做稍稍修改，就可以观测到这个变化：

```js
watch: {
  a: {
    deep: true,
    handler(newVal) {
      console.log(newVal)
    }
  }
}
```

这样就创建了一个 `deep watcher`，在 `watcher` 执行 `get` 求值的过程中有一段逻辑：

```js
get() {
  //……

  // "touch" every property so they are all tracked as
  // dependencies for deep watching
  if (this.deep) {
    traverse(value)
  }

  //……
}
```

在对 watch 的表达式或者函数求值后，会调用 `traverse` 函数，它定义在 `src/core/observer/watcher.js` 文件中：

```js
/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
const seenObjects = new Set()
function traverse(val: any) {
  seenObjects.clear()
  _traverse(val, seenObjects)
}

function _traverse(val: any, seen: ISet) {
  let i, keys
  const isA = Array.isArray(val)
  if ((!isA && !isObject(val)) || !Object.isExtensible(val)) {
    return
  }
  if (val.__ob__) {
    const depId = val.__ob__.dep.id
    if (seen.has(depId)) {
      return
    }
    seen.add(depId)
  }
  if (isA) {
    i = val.length
    while (i--) _traverse(val[i], seen)
  } else {
    keys = Object.keys(val)
    i = keys.length
    while (i--) _traverse(val[keys[i]], seen)
  }
}
```

`traverse` 的逻辑也很简单，它实际上就是对一个对象做深度递归遍历，因为遍历过程中就是对一个子对象的访问，会触发他们的 getter 过程，这样就可以收集到依赖，也就是订阅它们变化的 `watcher`，这个函数实现还有一个小的优化，遍历过程中会把子响应式对象它们的 `dep.id` 记录到 `seenObjects`，避免以后重复访问。
