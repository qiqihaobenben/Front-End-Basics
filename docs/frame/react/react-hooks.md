# React Hooks 详解

## Hooks 的出现

- 2015 年之前，React 通过 React.createClass 方法创建组件实例
- ES6 发布的 Class 语法得到支持后，React 遵循标准，从 v0.13.1 开始支持 Class 语法形式的组件，即 ClassComponent
- 为了解决 ClassComponent 存在的 **“业务逻辑分散”** 和 **“有状态的组件复用困难”** 两个问题，V16.8 带来了 Hooks
- 自 Hooks 问世后，React 的后续发展主要围绕 FC 展开，不再有关于 ClassComponent 的重要特性出现

## 心智模型——代数效应

### 概念

代数效应是函数式编程中的一个概念，用于将副作用从函数调用中分离。简单地说，就是一种在函数内部声明需要执行某些操作，但不立即执行它们的方式，这些操作的具体实现留给函数的调用者或者环境去处理。

## React Hooks 为什么没有使用细粒度更新?

原因在于 React 属于应用级框架，从关注“自变量与应用的对应关系”角度看，其更新粒度不需要很细，因此无需使用细粒度更新。

但是，作为代价，React Hooks 在使用上会受到两个制约：

1. 需要显式指明依赖
2. 不能在条件语句中声明 Hooks

## React Hooks 原理

### 引子

```js
import { useState } from 'react'

// useState 源码在 packages/react/src/ReactHooks.js
export function useState(initialState) {
  const dispatcher = resolveDispatcher()
  return dispatcher.useState(initialState)
}

// resolveDispatcher 函数定义
function resolveDispatcher() {
  const dispatcher = ReactCurrentDispatcher.current
  return dispatcher
}

// ReactCurrentDispatcher 的 current 默认定义为 null，后续会在 renderWithHooks 函数中真正赋值
const ReactCurrentDispatcher = {
  current: null,
}
```

### `renderWithHooks` 执行函数

包含 Hooks 功能的 FC 会在 `beginWork` 中执行 `renderWithHooks`，代码在：`packages/react-reconciler/src/ReactFiberBeginWork.js` 文件中

```
renderWithHooks(
  current, // current Fiber
  workInProgress, // workInProgress Fiber
  Component, // 函数组件本身
  props, // props
  secondArg,
  nextRenderLanes
)
```

#### 参数解释

1. **current**

   - **类型**：Fiber 节点
   - **说明**：表示组件在上一次渲染时的 Fiber 节点。如果是初次渲染，这个参数值为`null`。它包含了上一次渲染的状态，包括子 Fiber 节点、DOM 节点、钩子状态等。

2. **workInProgress**

   - **类型**：Fiber 节点
   - **说明**：表示当前正在进行的工作的 Fiber 节点。这是对`current`的克隆，React 将在这个节点上应用本次渲染期间的所有更新。一旦完成，它将成为下一次渲染的`current`。

3. **Component**

   - **类型**：函数组件
   - **说明**：当前正在渲染的函数组件本身。`renderWithHooks`将执行这个函数，传入`props`和`secondArg`（如果有的话），并处理返回的 jsx 或其他元素。

4. **props**

   - **类型**：Object
   - **说明**：包含组件接收到的所有属性的对象。这些是传递给组件函数的参数，组件内部通过这些`props`来渲染 UI 或执行逻辑。

5. **secondArg**

   - **类型**：任意
   - **说明**：这个参数通常用于传递给函数组件的第二个参数。对于大多数函数组件，这个参数是不需要的。在某些特殊情况下，比如使用`React.forwardRef`时，这个参数会被用来传递`ref`。

6. **nextRenderLanes**
   - **类型**：Lanes
   - **说明**：表示本次渲染的优先级。在 React 的并发模式中，每个更新都有自己的优先级（lane）。这个参数帮助 React 确定哪些更新应该在当前渲染中被处理，哪些可以被推迟到未来的渲染中。

```js
function renderWithHooks(current, workInProgress, Component, props, secondArg, nextRenderLanes) {
  renderLanes = nextRenderLanes
  currentlyRenderingFiber$1 = workInProgress // workInProgress Fiber 节点
  workInProgress.memoizedState = null // 存储 Hooks 单向链表
  workInProgress.updateQueue = null // 存储 effect 有向环形链表
  workInProgress.lanes = NoLanes

  /*
 * 对于第一次渲染组件，那么用的是 HooksDispatcherOnMount hooks对象。
对于渲染后，需要更新的函数组件，则是 HooksDispatcherOnUpdate 对象，那么两个不同就是通过current树上是否memoizedState（hook信息）来判断的。如果current不存在，证明是第一次渲染函数组件。
 */
  {
    if (current !== null && current.memoizedState !== null) {
      ReactCurrentDispatcher$1.current = HooksDispatcherOnUpdate
    } else {
      ReactCurrentDispatcher$1.current = HooksDispatcherOnMount
    }
  }
  /**
   * 调用 Component(props, secondArg) 执行我们的函数组件，我们的函数组件在这里真正的被执行了，然后，我们写的 hooks 被依次执行，把 hooks 信息依次保存到 workInProgress Fiber 节点上
   */
  var children = Component(props, secondArg)
  /**
   * 将 ContextOnlyDispatcher 赋值给 ReactCurrentDispatcher.current，也就是说如果不是在函数组件中，调用的 hooks，都是 ContextOnlyDispatcher 对象上 hooks
   */
  ReactCurrentDispatcher$1.current = ContextOnlyDispatcher

  renderLanes = NoLanes
  currentlyRenderingFiber$1 = null
  currentHook = null
  workInProgressHook = null

  return children
}
```

#### HooksDispatcherOnMount

第一次渲染

```
const HooksDispatcherOnMount = {
  useCallback: mountCallback,
  useEffect: mountEffect,
  useLayoutEffect: mountLayoutEffect,
  useMemo: mountMemo,
  useReducer: mountReducer,
  useRef: mountRef,
  useState: mountState,
  //...
};

```

#### HooksDispatcherOnUpdate

更新组件

```
const HooksDispatcherOnUpdate = {
  useCallback: updateCallback,
  useEffect: updateEffect,
  useLayoutEffect: updateLayoutEffect,
  useMemo: updateMemo,
  useReducer: updateReducer,
  useRef: updateRef,
  useState: updateState
  //...
};

```

#### ContextOnlyDispatcher

```
const ContextOnlyDispatcher = {
    useState:throwInvalidHookError
    // ...
}
function throwInvalidHookError() {
  invariant(
    false,
    'Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for' +
      ' one of the following reasons:\n' +
      '1. You might have mismatching versions of React and the renderer (such as React DOM)\n' +
      '2. You might be breaking the Rules of Hooks\n' +
      '3. You might have more than one copy of React in the same app\n' +
      'See https://fb.me/react-invalid-hook-call for tips about how to debug and fix this problem.',
  );
}

```

![](./images/renderWithHooks.png)

###
