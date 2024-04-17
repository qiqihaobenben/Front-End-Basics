# React 的源码流程

React 的源码架构分为三个部分：

- 调度器（Scheduler）：调度任务的优先级，高优任务优先进入 Reconciler
- 协调器（Reconciler）：VDOM 的实现，负责根据自变量变化计算出 UI 变化，简单的说就是找出变化的组件
- 渲染器（Renderer）：负责将变化的组件渲染到页面上

## 同步更新流程（shouldTimeSlice 为 false）

```js
import { createRoot } from 'react-dom'
const container = document.getElementById('app')
const root = createRoot(container)

root.render(<App />)
```

### ReactDOM.createRoot

```js
// 参数：
// container：DOM 元素，React 组件树将在其中进行渲染。
// options：可选配置对象，包括如何处理 Hydration 等。
function createRoot(container, options) {
  var hydrate = options != null && options.hydrate === true
  var hydrationCallbacks = (options != null && options.hydrationOptions) || null

  var isStrictMode = options != null && options.unstable_strictMode === true

  var root = createContainer(container, ConcurrentRoot, hydrate, hydrationCallbacks, isStrictMode)

  return new ReactDOMRoot(root)
}
```

`ReactDOM.createRoot(container, options?)`创建一个与 DOM 容器节点绑定的 root。这个 root 负责管理 React 组件树的渲染。 返回值为 `new ReactDOMRoot(root)`

```js
function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot
}
```

`ReactDOMRoot` 实例上有 `render` 方法，用于将 React 元素渲染到容器中，当项目中调用 `root.render(<App />)` 时，这标志着渲染操作的开始。

```js
//参数：
// children：React元素，通常是应用的顶层组件。
ReactDOMRoot.prototype.render = function (children) {
  const root = this._internalRoot
  var container = root.containerInfo
  updateContainer(children, root, null, null)
}
```

### render 阶段

Reconciler 工作的阶段在 React 内部被称为 render 阶段。

#### updateContainer

`updateContainer(element, container, parentComponent, callback?)` 在指定的 container 中渲染或更新给定的 React 元素。

- 创建或更新 Fiber 节点。
- 调用 schedulerUpdateOnFiber 以调度这个 Fiber 节点的更新。

#### scheduleUpdateOnFiber

scheduleUpdateOnFiber(fiber, lane, eventTime)，标记 Fiber 节点上的更新，并根据更新的优先级（lanes）安排执行。

- 计算更新的优先级，确定更新所在的 lane。
- 根据 Fiber 节点的优先级，调用 ensureRootIsScheduled 来确保根节点的任务被调度。

#### ensureRootIsScheduled

ensureRootIsScheduled(root) 确保整个应用的根节点（root）有一个调度任务。

- 检查 root 上是否有待执行的工作。
- 根据当前的调度优先级，调用 scheduler 的 schedulerCallback 进行任务调度。

```js
var schedulerPriorityLevel

switch (lanesToEventPriority(nextLanes)) {
  case DiscreteEventPriority:
    schedulerPriorityLevel = ImmediatePriority
    break

  case ContinuousEventPriority:
    schedulerPriorityLevel = UserBlockingPriority
    break

  case DefaultEventPriority:
    schedulerPriorityLevel = NormalPriority
    break

  case IdleEventPriority:
    schedulerPriorityLevel = IdlePriority
    break

  default:
    schedulerPriorityLevel = NormalPriority
    break
}
```

#### scheduleCallback

`scheduleCallback(priorityLevel, callback)` 根据给定的优先级，安排一个回调函数在合适的时间执行。scheduleCallback 实际上是调用了 Scheduler.unstable_scheduleCallback `var scheduleCallback = Scheduler.unstable_scheduleCallback`

```js
function unstable_scheduleCallback(priorityLevel, callback, options) {
  var currentTime = exports.unstable_now()
  var startTime

  if (typeof options === 'object' && options !== null) {
    var delay = options.delay

    if (typeof delay === 'number' && delay > 0) {
      startTime = currentTime + delay
    } else {
      startTime = currentTime
    }
  } else {
    startTime = currentTime
  }

  var timeout

  switch (priorityLevel) {
    case ImmediatePriority:
      timeout = IMMEDIATE_PRIORITY_TIMEOUT
      break

    case UserBlockingPriority:
      timeout = USER_BLOCKING_PRIORITY_TIMEOUT
      break

    case IdlePriority:
      timeout = IDLE_PRIORITY_TIMEOUT
      break

    case LowPriority:
      timeout = LOW_PRIORITY_TIMEOUT
      break

    case NormalPriority:
    default:
      timeout = NORMAL_PRIORITY_TIMEOUT
      break
  }

  var expirationTime = startTime + timeout
  var newTask = {
    id: taskIdCounter++,
    callback: callback,
    priorityLevel: priorityLevel,
    startTime: startTime,
    expirationTime: expirationTime,
    sortIndex: -1,
  }

  if (startTime > currentTime) {
    // This is a delayed task.
    newTask.sortIndex = startTime
    push(timerQueue, newTask)

    if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
      // All tasks are delayed, and this is the task with the earliest delay.
      if (isHostTimeoutScheduled) {
        // Cancel an existing timeout.
        cancelHostTimeout()
      } else {
        isHostTimeoutScheduled = true
      } // Schedule a timeout.

      requestHostTimeout(handleTimeout, startTime - currentTime)
    }
  } else {
    newTask.sortIndex = expirationTime
    push(taskQueue, newTask)
    // wait until the next time we yield.

    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true
      requestHostCallback(flushWork)
    }
  }

  return newTask
}
```

#### requestHostCallback 调用 schedulePerformWorkUntilDeadline

使用 postMessage 技术确保在下一个 JavaScript 宏任务前执行工作。

```js
var channel = new MessageChannel()
var port = channel.port2
channel.port1.onmessage = performWorkUntilDeadline
schedulePerformWorkUntilDeadline = function () {
  // 设置一个微任务，准备在浏览器的空闲时执行。
  port.postMessage(null)
}
```

#### performWorkUntilDeadline 调用 flushWork 清空所有工作队列，执行所有剩余的工作。

#### flushWork 调用 workLoop 处理所有的工作单元，直到队列清空或达到浏览器的帧限制。

#### workLoop 调用 并发地执行根节点上的工作。

利用 React 的 Fiber 架构并发地执行更新，允许中断和恢复。

####

判断 shouldTimeSlice 为 false，调用 renderRootSync 同步渲染根节点。同步遍历 Fiber 树，执行更新，不允许任务中断。renderRootSync 会调用 workLoopSync。

判断 shouldTimeSlice 为 true，调用 renderRootConcurrent 异步渲染根节点。异步遍历 Fiber 树，执行更新，允许任务中断。renderRootConcurrent 会调用 workLoopConcurrent。

```js
function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress)
  }
}

function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress)
  }
}
```

#### renderRootSync 调用 workLoopSync 同步执行工作循环。

#### workLoopSync 调用 performUnitOfWork

performUnitOfWork 方法会创建下一个 fiberNode 并赋值给 workInProgress，并将 workInProgress 与已创建的 fiberNode 连接起来构成 Fiber Tree。

performUnitOfWork 中会调用 beginWork 和 completeWork，分别处理开始和结束工作。在遍历的过程中，会为 FiberNode 标记“代表不同副作用的 flags”，以便后续在 Renderer 中使用。

#### beginWork

beginWork 首先判断当前流程属于 mount 还是 update，判断依据为 current Fiber 是否存在（`current !== null`）。

如果当前流程为 update 流程，则 workInProgress FiberNode 存在对应的 Current FiberNode（`current = workInProgress.alternate`）。如果本次更新不影响 FiberNode.child，则可以复用对应的 Current FiberNode（`attemptEarlyBailoutIfNoScheduledUpdate`），这是一条 render 阶段的优化路径。

如果无法复用 Current FiberNode，则 mount 和 update 的流程大体一致，包括：

- 根据 workInProgress.tag 进入“不同类型元素的处理分支”
  - HostComponent 代表原生 Element 类型（比如 DIV、SPAN）
  - IndeterminateComponent 是 FC mount 时进入的分支，update 时则进入 FunctionComponent 分支
  - HostText 代表文本元素类型
- 使用 reconcile 算法生成下一级 fiberNode
  - 如果常见类型（比如 FunctionComponent、ClassComponent、HostComponent）没有命中优化策略，它们最终会调用 reconcileChildFibers 函数生成子 fiberNode

**beginWork 的 mount 和 update 的区别在于：最终是否会为“生成的子 fiberNode”标记“副作用 flags”**

##### reconcileChildFibers

reconcileChildFibers 负责协调（或者说更新）子 Fiber，它对比现有子 Fiber 节点与新生成的 React 元素之间的差异，决定子 Fiber 节点中哪些节点需要更新、删除或者创建，在这个方法中只是对子 Fiber 节点添加了 `returnFiber.flags |= ChildDeletion` 或 `newFiber.flags |= Placement` 这些标记。

#### completeWork

completeWork 具体逻辑如下：

- 根据 workInProgress.tag 进入不同的分支
- 在每个分支中，根据 `current !== null` 区分 mount 和 update 流程
- 完成 mount 或 update 流程后，都会执行 bubbleProperties 方法完成 flags 的冒泡

##### completeWork 的 mount 流程

- 例如对于 HostComponent，在 mount 流程中首先会调用 createInstance 方法创建对应的 DOM 元素
- 然后执行 `appendAllChildren` 将下一级 DOM 元素挂在在上一步创建的 DOM 元素下
- 执行 `finalizeInitialChildren` 完成属性的初始化
  - styles，对应 `setValueForStyles`方法
  - innerHTML，对应 `setInnerHTML` 方法
  - 文本类型 children，对应 `setTextContent` 方法
  - 不会在 DOM 中冒泡的事件，包括 cancel、close、invalid、load、scroll、toggle，对应 `listenToNonDelegatedEvent` 方法
  - 其他属性，对应 `setValueForProperty` 方法

##### completeWork 的 update 流程

- 例如对于 HostComponent，在 update 流程中首先会调用 updateHostComponent 方法，主要是标记属性的更新
- 如果 oldProps 和 newProps 相等，会直接 return，如果不相等，会调用 `diffProperties` 方法
- `diffProperties` 方法包含两次遍历：
  - 第一次遍历：标记删除“更新前有，更新后没有”的属性
  - 第二次遍历：标记更新“update 流程前后发生改变”的属性
- 所有变化属性的 key，value 会保存在 fiberNode.updateQueue 中，同时会标记 `fiberNode.flags |= Update`

beginWork 的 reconcileChildFibers 方法用来“标记 fiberNode 的插入、删除、移动”，completeWork 方法才是真正的将 UI 的变化整理出来，例如 HostComponent 的 mount 过程，会将生成的 DOM 元素放到 workInProgress.stateNode 然后挂在到父 DOM 上，update 过程会将属性的变化放到 updateQueue 中。

#### completeWork 的上层 completeUnitOfWork

completeUnitOfWork 中除了调用 completeWork 处理当前节点外，在最后会执行一下代码：

```js
// beginWork 执行完，next 为 null 时，进入 completeWork，completeWork 执行完，会检查是否有 sibling
var siblingFiber = completedWork.sibling
// 如果有 siblingFiber，将 workInProgress 指向 siblingFiber，重新执行 performUnitOfWork
if (siblingFiber !== null) {
  workInProgress = siblingFiber
  return
}
// 如果没有 siblingFiber ，就进行 returnFiber 的 completeWork
completedWork = returnFiber
workInProgress = completedWork
```

### commit 阶段

Renderer（渲染器）工作的阶段被称为 commit 阶段。在 commit 阶段，会将各种副作用（flags）commit（提交） 到宿主环境的 UI 中。

**render 阶段流程可能会被打断，而 commit 阶段一旦开始就会同步执行直到完成**

commit 工作流程分为三个阶段：

- 开始前的准备工作，比如判断“是否有副作用需要执行”
- 处理副作用
- 结束后的收尾工作，比如调度新的更新

处理副作用阶段还可以分为三个子阶段：

- BeforeMutation 阶段
- Mutation 阶段
- Layout 阶段

commit 阶段的起点开始与 commitRoot 方法的调用。

那么 commitRoot 方法在什么时候调用？

函数会调用 renderRootSync 或 renderRootConcurrent，最后会调用 finishConcurrentRender 函数。

renderRootSync 或 renderRootConcurrent 中调用 completeUnitOfWork 的最后，会设置 `workInProgressRootExitStatus = RootCompleted`，表示整个 workInProgress Fiber Tree 的构建完成。

在 finishConcurrentRender 函数中判断 exitStatus 等于 RootCompleted，会调用 commitRoot 函数。

#### commitRoot

commmitRoot(root) 的参数：

- root 代表“本次更新所属的 FiberRootNode”
- root.finishedWork 代表 workInProgress HostRootFiber，即“render 阶段构建的 wokeInProgress Fiber Tree” 的 HostRootFiber

在三个子阶段执行之前，需要判断本次更新是否涉及“与三个子阶段相关的副作用” 逻辑如下：

```js
function commitRootImpl(root, renderPriorityLevel) {
  // 省略之前代码
  var finishedWork = root.finishedWork
  // subtreeHasEffects 代表 workInProgress HostRootFiber 的子孙元素存在的副作用 flags
  var subtreeHasEffects = (finishedWork.subtreeFlags & (BeforeMutationMask | MutationMask | LayoutMask | PassiveMask)) !== NoFlags
  // rootHasEffect 代表 workInProgress HostRootFiber 自身存在的副作用 flags
  var rootHasEffect = (finishedWork.flags & (BeforeMutationMask | MutationMask | LayoutMask | PassiveMask)) !== NoFlags

  if (subtreeHasEffects || rootHasEffect) {
    // 本次更新存在与三个子阶段相关的副作用
    // 进入 commit 阶段的三个子阶段
    var shouldFireAfterActiveInstanceBlur = commitBeforeMutationEffects(root, finishedWork)
    commitMutationEffects(root, finishedWork, lanes)
    commitLayoutEffects(finishedWork, root, lanes)
  } else {
    // 省略：本次更新没有三个子阶段的副作用
  }
}
```

##### mask 参考

- Update:
  - ClassComponent 存在更新，且定义了 componentDidMount 或 componentDidUpdate 方法；
  - HostComponent 发生了属性变化
  - HostText 发生了内容变化
  - FC 定义了 useLayoutEffect
- Snapshot： ClassComponet 存在更新，且定义了 getSnapshotBeforeUpdate 方法
- Placement：当前 fiberNode 或子孙 fiberNode 存在“需要插入或移动的 HostComponent”
- ChildDeletion：当前 fiberNode 或子孙 fiberNode 存在“需要删除的子 HostComponent 或子 HostText”
- ContentReset：清空 HostComponent 的文本内容
- Ref：HostComponent ref 属性的创建与更新
- Hydrating： hydrate 相关
- Visibility： 控制 SuspenseComponent 的子树与 fallback 切换时子树的显隐
- Callback： 当 ClassComponent 中的 this.setState 执行时，或 ReactDOM.render 执行时传递了回调函数参数
- Passive：FC 中定义了 useEffect 且需要触发回调函数

例如：

```
BeforeMutationMask： Update | Snapshot | 0，代表 BeforeMutation 子阶段跟 Update 和Snapshot 相关。由于 Snapshot 是“ClassComponet 存在更新，且定义了getSnapshotBeforeUpdate 方法”后才会设置的 flags，因此可以判断 BeforeMutation 子阶段会执行 getSnapshotBeforeUpdate 方法。
```

#### commitBeforeMutationEffects

commitBeforeMutationEffects 会调用 commitBeforeMutationEffects_begin

```js
function commitBeforeMutationEffects(root, firstChild) {
  // 省略之前代码
  nextEffect = firstChild
  commitBeforeMutationEffects_begin()

  // 省略重置全局变量
}
```

##### commitBeforeMutationEffects_begin 会调用 commitBeforeMutationEffects_complete

```js
function commitBeforeMutationEffects_begin() {
  // 向下遍历直到“第一个满足如下条件之一的 fiberNode”
  // 1. 当前 fiberNode 的子 fiberNode 不包含“该子阶段对应的 flags”，即当前 fiberNode 是“包含该子阶段对应的 flags”的“层级最低”的 fiberNode
  while (nextEffect !== null) {
    var fiber = nextEffect

    var child = fiber.child

    if ((fiber.subtreeFlags & BeforeMutationMask) !== NoFlags && child !== null) {
      // 省略代码
      nextEffect = child
    } else {
      commitBeforeMutationEffects_complete()
    }
  }
}
// commitBeforeMutationEffects_complete 用来执行 “flags 对应的操作”
function commitBeforeMutationEffects_complete() {
  while (nextEffect !== null) {
    var fiber = nextEffect
    setCurrentFiber(fiber)

    try {
      // 对当前 fiberNode 执行“flags 对应的操作”
      commitBeforeMutationEffectsOnFiber(fiber)
    } catch (error) {
      // 错误处理
      captureCommitPhaseError(fiber, fiber.return, error)
    }

    resetCurrentFiber()
    var sibling = fiber.sibling

    if (sibling !== null) {
      // 如果当前 fiberNode 存在兄弟 fiberNode，nextEffect 赋值为 sibling，再次走到commitBeforeMutationEffects_begin的 while 循环中
      nextEffect = sibling
      return
    }
    // 如果当前 fiberNode 不存在兄弟 fiberNode，nextEffect 赋值为 父 fiberNode，再次走到commitBeforeMutationEffects_begin的 while 循环中
    nextEffect = fiber.return
  }
}
```

以上可以看出，如果说 render 阶段的 completeWork 会完成“自下而上”的 subtreeFlags 标记过程，那么 commit 阶段的 commitBeforeMutationEffects 会完成“自下而上”的 subtreeFlags 消费过程。

##### commitBeforeMutationEffectsOnFiber

主要处理一下两种类型的 fiberNode：

- ClassComponent 执行 getSnapshotBeforeUpdate 方法
- HostRoot 清空 HostRoot 挂载的内容，方便 Mutation 子阶段的渲染

#### commitMutationEffects

commitMutationEffects 跟 commitBeforeMutationEffects 的逻辑类似：

- commitMutationEffects 会调用 commitMutationEffects_begin
- commitMutationEffects_begin 会调用 commitMutationEffects_complete
  - commitMutationEffects_begin 有特有的 commitDeletion 逻辑，用来处理“需要删除的 fiberNode”，需要考虑的事情很多：子树中所有组件的 ummout 逻辑，子树中所有 ref 属性的卸载操作，子树中所有 effect 相关 Hook 的 destory 回调执行等

##### commitMutationEffectsOnFiber

- Placement flag 对应 commitPlacement 方法，执行流程分为三个步骤
  - 从当前 fiberNode 向上遍历，获取第一个类型为 HostComponent、HostRoot、HostPortal 三者之一的祖先 fiberNode，其对应的 DOM 元素是“执行 DOM 操作的目标元素的父级 DOM 元素” `var parentFiber = getHostParentFiber(finishedWork) `
  - 获取用于执行 parentNode.insertBefore(child, before) 方法的 “before 对应 DOM 元素” `var before = getHostSibling(finishedWork)`
  - 执行 parentNode.insertBefore 方法（存在 before 的情况）或 parentNode.appendChild 方法（不存在 before 的情况）
- Update flag 对应 commitWork 方法
  - 对于 FC 等类型的 fiberNode，会执行 commitHookEffectListUnmount 和 commitHookEffectListMount 方法
  - 对于 HostComponent 类型的 fiberNode，会执行 commitUpdate 方法，commitUpdate 方法又会调用 updateProperties 最终会在 updateDomProperties 方法中遍历并改变对应属性，处理以下四种类型的数据
    - style 属性变化
    - innerHTML
    - 直接文本节点变化
    - 其他元素属性

#### commitLayoutEffects

commitLayoutEffects 跟 commitBeforeMutationEffects 的逻辑类似：

- commitLayoutEffects 会调用 commitLayoutEffects_begin
- commitLayoutEffects_begin 会调用 commitLayoutEffects_complete

##### Fiber Tree 切换

在进入 Layout 子阶段之前，会执行如下代码完成 Fiber Tree 的切换：

```js
root.current = finishedWork
```

之所以选择这一时机切换 Fiber Tree，是因为对于 ClassComponent，当执行 componentWillUnMount 时（Mutation 子阶段），Current Fiber Tree 仍对应 UI 中的树。当执行 commponentDidMount/Update 时（Layout 子阶段），Current Fiber Tree 已经对应本次更新的 Fiber Tree。

##### useLayoutEffect callback 会在该阶段执行

##### commitLayoutEffectsOnFiber

- 对于 ClassComponent
  - 会执行 componentDidMount 或 componentDidUpdate 方法
  - 执行 this.setState(newState, callback) 传递的 callback 参数会保存在对应的 fiberNode.updateQueue 中，commitLayoutEffectsOnFiber 会执行这些 callback
- 对于 FC，会执行 useLayoutEffect callback
- 对于 HostRoot，执行 ReactDOM.render 传递的 callback 参数会保存在对应的 fiberNode.updateQueue 中，commitLayoutEffectsOnFiber 会执行这些 callback
